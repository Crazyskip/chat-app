import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../user';
import { Group } from '../../group';
import { Channel } from '../../channel';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
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
  user: User | undefined;
  group: Group | undefined;

  message: string = '';

  selected: { group: Group; channel: Channel } | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private authService: AuthService,
    private socketService: SocketService
  ) {
    this.authService.currentUserChange.subscribe((value) => {
      this.user = value;
    });
    this.user = this.authService.getUser();
    if (!this.user) this.router.navigateByUrl('/home');
  }

  messageSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.getGroup();
  }

  getGroup(): void {
    const groupID = this.route.snapshot.paramMap.get('id');
    if (groupID) {
      this.groupService.getGroup(groupID).subscribe((response) => {
        if (response.group) {
          this.group = response.group;
        } else {
          alert(`Could not find group with id: ${groupID}`);
        }
      });
    }
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  handleSelect(group: Group, channel: Channel) {
    if (this.user && this.selected) {
      this.socketService.leaveRoom(
        this.user.id,
        this.selected.group._id,
        this.selected.channel.id
      );
      this.messageSubscription.unsubscribe();
    }
    this.selected = { group, channel };
    this.message = '';
    if (this.user) {
      this.joinChannel(this.user.id, group._id, channel.id);
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
        this.selected?.channel.messages.push(message);
      });
  }

  sendMessage(f: NgForm) {
    if (f.value.message !== '' && this.selected && this.user) {
      this.socketService.send(
        this.user.id,
        this.selected.group._id,
        this.selected.channel.id,
        f.value.message
      );
      this.message = '';
      // this.groupService
      //   .addMessage(
      //     this.selected.group._id,
      //     this.selected.channel.id,
      //     this.user.id,
      //     f.value.message
      //   )
      //   .subscribe(
      //     (response) => {
      //       if (response.success && this.user && this.selected) {
      //         this.selected.channel.messages.push({
      //           user: response.message.user,
      //           message: response.message.message,
      //         });
      //         this.message = '';
      //       } else {
      //         alert('Failed to send message');
      //       }
      //     },
      //     (error) => alert('Failed to send message')
      //   );
    }
  }
}
