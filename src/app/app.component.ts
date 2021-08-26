import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  user: User | undefined;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.currentUserChange.subscribe((value) => {
      this.user = value;
      console.log('In App');
      if (!this.user) this.router.navigateByUrl('/home');
    });
    this.authService.checkLogin();
  }

  logout() {
    this.authService.logout();
  }
}
