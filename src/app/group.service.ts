import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from './user';
import { Group } from './group';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  url = 'http://localhost:3000/api/groups';

  currentUser: User | undefined;
  currentUserChange: Subject<User> = new Subject<User>();

  constructor(private http: HttpClient) {
    this.currentUserChange.subscribe((value) => {
      this.currentUser = value;
    });
  }

  getGroups(user: User): Observable<{
    groups: Group[];
  }> {
    return this.http.post<{
      groups: Group[];
    }>(this.url, { user });
  }
}
