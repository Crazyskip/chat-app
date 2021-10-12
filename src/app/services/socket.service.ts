import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket = io(SERVER_URL);

  constructor() {}

  // Joins socket room
  public joinRoom(userID: number, groupID: string, channelID: number): void {
    this.socket.emit('joinRoom', { userID, groupID, channelID });
  }

  // Leaves socket room
  public leaveRoom(userID: number, groupID: string, channelID: number): void {
    this.socket.emit('leaveRoom', { userID, groupID, channelID });
  }

  // Send message to sockets
  public send(
    userID: number,
    groupID: string,
    channelID: number,
    message: string
  ): void {
    this.socket.emit('message', { userID, groupID, channelID, message });
  }

  // On message recieved update subscription
  public onMessage(): Observable<any> {
    let observable = new Observable((observer) => {
      this.socket.on(
        'message',
        (data: { user: number; message: string; date: Date }) =>
          observer.next(data)
      );
    });
    return observable;
  }
}
