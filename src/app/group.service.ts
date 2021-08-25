import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { Group } from './group';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  url = 'http://localhost:3000/api/groups';

  constructor(private http: HttpClient) {}

  getGroups(user: User): Observable<{
    groups: Group[];
  }> {
    return this.http.post<{
      groups: Group[];
    }>(this.url, { user });
  }
}
