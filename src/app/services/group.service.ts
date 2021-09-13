import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../group';
import { Channel } from '../channel';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  groupsURL = 'http://localhost:3000/api/groups/';
  groupURL = 'http://localhost:3000/api/group/';

  constructor(private http: HttpClient) {}

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

  addGroup(group: Group): Observable<{ group: Group }> {
    return this.http.post<{ group: Group }>(this.groupURL, group);
  }

  updateGroup(group: Group): Observable<{ group: Group }> {
    return this.http.put<{ group: Group }>(this.groupURL + group.id, group);
  }

  deleteGroup(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(this.groupURL + id);
  }

  addChannel(groupID: number, channel: Channel) {
    return this.http.post(`${this.groupURL + groupID}/channel`, { ...channel });
  }

  updateChannel(
    groupID: number,
    channelID: number,
    channelName: string,
    channelMembers: number[]
  ) {
    return this.http.put(`${this.groupURL + groupID}/channel/${channelID}`, {
      channelName,
      channelMembers,
    });
  }

  deleteChannel(groupID: number, channelID: number) {
    return this.http.delete(`${this.groupURL + groupID}/channel/${channelID}`);
  }

  addMessage(
    groupID: number,
    channelID: number,
    userID: number,
    message: string
  ): Observable<{
    success: boolean;
    message: { user: number; message: string };
  }> {
    return this.http.post<{
      success: boolean;
      message: { user: number; message: string };
    }>(`${this.groupURL + groupID}/channel/${channelID}`, { userID, message });
  }
}
