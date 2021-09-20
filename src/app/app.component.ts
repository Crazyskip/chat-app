import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from './services/auth.service';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  user: User | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private location: Location
  ) {
    this.authService.currentUserChange.subscribe((value) => {
      this.user = value;
      this.handleRouting();
    });
    this.authService.checkLogin();
  }

  private handleRouting(): void {
    if (this.location.path() === '/home' && this.user) {
      this.router.navigateByUrl('/groups');
    } else if (this.location.path() !== '/home' && !this.user) {
      this.router.navigateByUrl('/home');
    }
  }

  logout(): void {
    this.authService.logout();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }
}
