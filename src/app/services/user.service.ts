import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../user';

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

  addUser(formData: FormData): Observable<{ user: User; err: string }> {
    return this.http.post<{ user: User; err: string }>(this.userURL, formData);
  }

  updateUser(user: User): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(this.userURL + user.id, user);
  }

  deleteUser(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(this.userURL + id);
  }
}
