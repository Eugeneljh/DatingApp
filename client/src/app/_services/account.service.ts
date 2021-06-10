import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PresenceService } from './presence.service';

// @Injectable -> This service can be injected into other componenets or services in your application
// providedIn: 'root' -> Instead of adding the services into app.component.ts 'providers []'
// Angular service is a singleton, it will stay initialize until it is disposed off. (Close browser, or move away from it)
@Injectable({
  providedIn: 'root'
})
// use to make request to our API
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);  // ReplaySubject stores value inside and emits the last value that it was subscribed to
  currentUser$ = this.currentUserSource.asObservable();   // '$' at the end signifies it as an Observable


  constructor(private http: HttpClient, private presenceService: PresenceService) { }

  
  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe( // Anything in the pipe is an RXJS operator
      map((response: User) => {
        const user = response;
        if (user) {
          // Populate user object in localStorage, give key of 'user' and stringify the object we get back
          // Set ReplaySubject to next User we get back
          this.setCurrentUser(user);
          this.presenceService.createHubConnection(user);
        }
      })
    )
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user) {
          this.setCurrentUser(user);
          this.presenceService.createHubConnection(user);
        }
      })
    )
  }

  setCurrentUser(user: User) {
    user.role = [];
    const roles = this.getDecodedToken(user.token).role;
    // roles is only an array if user has more than one role,
    // else roles is just a string
    // we will need to check if roles is an array or string
    Array.isArray(roles) ? user.role = roles : user.role.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined);
    this.presenceService.stopHubConnection();
  }

  getDecodedToken(token) {
    // atob ->  Decode information inside the token
    //          Split token (Header, Payload, Signature) we want the Payload
    return JSON.parse(atob(token.split('.')[1]));
  }
}
