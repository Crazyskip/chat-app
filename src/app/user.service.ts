import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersURL = 'http://localhost:3000/api/users/';
  userURL = 'http://localhost:3000/api/user/';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(this.usersURL);
  }

  addUser(user: User): Observable<{ user: User }> {
    return this.http.post<{ user: User }>(this.userURL, user);
  }

  updateUser(user: User): Observable<{ user: User }> {
    return this.http.put<{ user: User }>(this.usersURL + user.id, user);
  }
}
