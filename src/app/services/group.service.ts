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

  getGroup(_id: string): Observable<{ group: Group }> {
    return this.http.get<{ group: Group }>(this.groupURL + _id);
  }

  addGroup(group: Group): Observable<{ group: Group }> {
    return this.http.post<{ group: Group }>(this.groupURL, group);
  }

  updateGroup(group: Group): Observable<{ group: Group }> {
    return this.http.put<{ group: Group }>(this.groupURL + group._id, group);
  }

  deleteGroup(_id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(this.groupURL + _id);
  }

  addChannel(_id: string, channel: Channel) {
    return this.http.post(`${this.groupURL + _id}/channel`, { ...channel });
  }

  updateChannel(
    _id: string,
    channelID: number,
    channelName: string,
    channelMembers: number[]
  ) {
    return this.http.put(`${this.groupURL + _id}/channel/${channelID}`, {
      channelName,
      channelMembers,
    });
  }

  deleteChannel(_id: string, channelID: number) {
    return this.http.delete(`${this.groupURL + _id}/channel/${channelID}`);
  }

  addMessage(
    _id: string,
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
    }>(`${this.groupURL + _id}/channel/${channelID}`, { userID, message });
  }
}
