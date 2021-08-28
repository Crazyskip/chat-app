import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
import { Group } from './group';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  groupsURL = 'http://localhost:3000/api/groups/';
  groupURL = 'http://localhost:3000/api/group/';

  constructor(private http: HttpClient) {}

  getGroupsOld(user: User): Observable<{
    groups: Group[];
  }> {
    return this.http.post<{
      groups: Group[];
    }>(this.groupsURL, { user });
  }

  getGroups(): Observable<{
    groups: Group[];
  }> {
    return this.http.get<{
      groups: Group[];
    }>(this.groupsURL);
  }

  getGroup(id: number): Observable<{ group: Group }> {
    return this.http.get<{ group: Group }>(this.groupURL + id);
  }

  updateGroup(group: Group): Observable<{ group: Group }> {
    return this.http.put<{ group: Group }>(this.groupURL + group.id, group);
  }
}
