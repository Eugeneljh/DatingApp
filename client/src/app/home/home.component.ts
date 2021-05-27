import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  // users: any; //Used for inheritance example

  constructor() { }

  ngOnInit(): void {
    // this.getUsers(); // Used as an example for inhertiance
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  // ** Used as an example for inheritance between Home and Register component **
  // Response we get back from the api is an array of users
  // Setting this.user's property in our class to the users we get back in our response
  // getUsers() {
  //   this.http.get('https://localhost:5001/api/users').subscribe(users => this.users = users);
  // }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }
}
