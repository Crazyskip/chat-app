import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { User } from '../user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = 'http://localhost:3000/api/auth';

  currentUser!: User;
  currentUserChange: Subject<User> = new Subject<User>();

  constructor(private http: HttpClient) {
    this.currentUserChange.subscribe((value) => {
      this.currentUser = value;
    });
  }

  // Sends login data to server
  login(username: string, password: string): void {
    this.http
      .post<{
        success: boolean;
        user: User;
      }>(this.url, {
        username,
        password,
      })
      .subscribe((data) => {
        // If correct store user data in local Storage and update subscription
        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.user));
          this.currentUserChange.next(data.user);
        } else {
          alert('Username or password does not match');
        }
      });
  }

  // Clears user from local storage and update subscription
  logout(): void {
    localStorage.removeItem('user');
    this.currentUserChange.next(undefined);
  }

  // Check if user is in local storage and update subscription
  checkLogin(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.currentUserChange.next(JSON.parse(userString));
    } else {
      this.currentUserChange.next(undefined);
    }
  }

  getUser(): User {
    return this.currentUser;
  }

  // Returns if current user is super admin or group admin
  isAdmin(): boolean {
    if (this.currentUser) {
      const adminStrings = ['super admin', 'group admin'];
      if (adminStrings.includes(this.currentUser.role)) return true;
    }
    return false;
  }

  // Returns if current user is super admin
  isSuperAdmin(): boolean {
    if (this.currentUser) {
      return this.currentUser.role === 'super admin';
    }
    return false;
  }
}
