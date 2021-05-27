import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Dating App';
  users: any;

  constructor(private accountService: AccountService) {}
  
  ngOnInit(): void {
 
    this.setCurrentUser();
  }

  setCurrentUser() {
    // Using JSON.parse() to get stringify form from login() method in account.service.ts into Object form here
    // We are setting the current user in our account service 
    // This helps the browser to persist the login after refreshing or closing the browser
    const user: User = JSON.parse(localStorage.getItem('user') ?? '');
    this.accountService.setCurrentUser(user);
  }

  
}
