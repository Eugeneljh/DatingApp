import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser: User | undefined;

    // using 'take(1)' - We want to complete after taking 1 of the users,
    // we do not have to unsubscribe by using this method. Essentially, once the observable is completed
    // we will not be subscribed to it anymore
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user);

    // If currentUser is not null, clone the request and
    // add the authentication header onto it
    if (currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }

    return next.handle(request);
  }
}
