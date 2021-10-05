import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Channel } from '../../channel';
import { Group } from '../../group';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.css'],
})
export class EditChannelComponent implements OnInit {
  @Input() group!: Group;
  @Input() channel!: Channel;
  members: any[] = [];

  channelName: string = '';

  constructor(
    private groupService: GroupService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.channelName = this.channel.name;
    this.userService.getUsers().subscribe((response) => {
      if (response.users) {
        response.users.forEach((user) => {
          if (this.group.members.includes(user.id))
            this.members.push({
              ...user,
              selected: this.channel.members.includes(user.id),
            });
        });
      }
    });
  }

  updateChannel() {
    if (this.channelName !== '') {
      const memberIds: number[] = [];
      this.members.forEach((member) => {
        if (member.selected) memberIds.push(member.id);
      });

      this.groupService
        .updateChannel(
          this.group._id,
          this.channel.id,
          this.channelName,
          memberIds
        )
        .subscribe(
          (response) => {
            alert('Updated Channel');
          },
          (error) => {
            alert('failed to update channel');
          }
        );
    }
  }

  deleteChannel() {
    this.groupService.deleteChannel(this.group._id, this.channel.id).subscribe(
      (response) => {
        console.log(response);
        const channelIndex = this.group.channels.findIndex(
          (channel) => channel.id === this.channel.id
        );
        this.group.channels.splice(channelIndex, 1);
      },
      (error) => {
        alert('failed to delete channel');
      }
    );
  }
}
