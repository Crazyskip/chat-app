import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/user';
import { Group } from '../../group';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.css'],
})
export class AddChannelComponent implements OnInit {
  @Input() group!: Group;
  channelName: string = '';
  members: any[] = [];

  constructor(
    private groupService: GroupService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((response) => {
      if (response.users) {
        response.users.forEach((user) => {
          if (this.group.members.includes(user.id))
            this.members.push({ ...user, selected: false });
        });
      }
    });
  }

  // Sends add channel
  addChannel() {
    if (this.channelName !== '') {
      const memberIds: number[] = [];
      this.members.forEach((member) => {
        if (member.selected) memberIds.push(member.id);
      });

      const newChannel = {
        id: Math.floor(Math.random() * 10_000_000),
        name: this.channelName,
        members: memberIds,
        messages: [],
      };

      this.groupService.addChannel(this.group._id, newChannel).subscribe(
        (response) => {
          // If added append channel to group channels
          if (response.success) {
            this.group.channels.push({ ...newChannel });
            // Deselect all members
            this.members.forEach((member) => {
              if (member.selected) member.selected = false;
            });
          } else {
            alert('failed to add channel');
          }
        },
        (error) => {
          alert('failed to add channel');
        }
      );

      this.channelName = '';
    }
  }
}
