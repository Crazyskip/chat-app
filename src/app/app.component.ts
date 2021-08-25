import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  username: string = '';

  user: User | undefined;

  constructor(private authService: AuthService) {
    this.authService.currentUserChange.subscribe((value) => {
      this.user = value;
    });
    this.authService.checkLogin();
  }

  login(f: NgForm) {
    const username = f.value.username;
    this.authService.login(username);
  }

  logout() {
    this.authService.logout();
  }
}
