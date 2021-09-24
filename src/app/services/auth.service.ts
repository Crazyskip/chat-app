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
        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.user));
          this.currentUserChange.next(data.user);
        } else {
          alert('Username or password does not match');
        }
      });
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserChange.next(undefined);
  }

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
