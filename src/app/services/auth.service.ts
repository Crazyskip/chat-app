import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { User } from '../user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = 'http://localhost:3000/api/auth';

  currentUser: User | undefined;
  currentUserChange: Subject<User> = new Subject<User>();

  constructor(private http: HttpClient) {
    this.currentUserChange.subscribe((value) => {
      this.currentUser = value;
    });
  }

  login(username: string): void {
    this.http
      .post<{
        success: boolean;
        user: User;
      }>(this.url, {
        username,
      })
      .subscribe((data) => {
        if (data.success) {
          if (typeof Storage !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(data.user));
            this.currentUserChange.next(data.user);
          }
        }
      });
  }

  logout(): void {
    if (typeof Storage !== undefined) {
      localStorage.removeItem('user');
      this.currentUserChange.next(undefined);
    } else {
      alert('Failed logging out');
    }
  }

  checkLogin(): void {
    if (typeof Storage != undefined) {
      if (localStorage.getItem('user')) {
        const userString = localStorage.getItem('user');
        if (userString) {
          this.currentUserChange.next(JSON.parse(userString));
        }
      }
    }
  }

  getUser(): User | undefined {
    return this.currentUser;
  }

  isAdmin(): boolean {
    if (this.currentUser) {
      const adminStrings = ['super admin', 'group admin'];
      if (adminStrings.includes(this.currentUser.role)) return true;
    }
    return false;
  }

  isSuperAdmin(): boolean {
    if (this.currentUser) {
      return this.currentUser.role === 'super admin';
    }
    return false;
  }
}
