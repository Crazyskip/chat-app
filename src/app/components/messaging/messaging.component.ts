import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../user';
import { Group } from '../../group';
import { Channel } from '../../channel';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from '../../message';
import { NgForm } from '@angular/forms';
import { SocketService } from 'src/app/services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css'],
})
export class MessagingComponent implements OnInit {
  user: User;
  group: Group | undefined;
  message: string = '';
  selected: Channel | undefined;
  messageSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private authService: AuthService,
    private socketService: SocketService
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.getGroup();
  }

  private getGroup(): void {
    const groupID = this.route.snapshot.paramMap.get('id');
    if (groupID) {
      this.groupService.getGroup(groupID).subscribe((response) => {
        if (response.group) {
          this.group = response.group;
        } else {
          alert(`Could not find group with id: ${groupID}`);
          this.router.navigateByUrl('/groups');
        }
      });
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  handleSelect(channel: Channel) {
    if (this.group) {
      if (this.selected) {
        this.leaveChannel(this.user.id, this.group._id, this.selected.id);
      }
      this.groupService
        .getChannel(this.group._id, channel.id)
        .subscribe((response) => {
          this.selected = response.channel;
        });
      this.joinChannel(this.user.id, this.group._id, channel.id);
      this.message = '';
    }
  }

  getReversedMessages(messages: Message[]) {
    return [...messages].reverse();
  }

  joinChannel(userID: number, groupID: string, channelID: number) {
    this.socketService.joinRoom(userID, groupID, channelID);
    this.messageSubscription = this.socketService
      .onMessage()
      .subscribe((message: Message) => {
        if (this.selected) this.selected.messages.push(message);
      });
  }

  leaveChannel(userID: number, groupID: string, channelID: number) {
    this.socketService.leaveRoom(userID, groupID, channelID);
    this.messageSubscription.unsubscribe();
  }

  sendMessage() {
    if (this.group && this.message !== '' && this.selected) {
      this.socketService.send(
        this.user.id,
        this.group._id,
        this.selected.id,
        this.message
      );
      this.message = '';
    }
  }
}
