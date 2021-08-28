import { Component, OnInit, Input } from '@angular/core';
import { Channel } from '../channel';
import { Group } from '../group';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.css'],
})
export class EditChannelComponent implements OnInit {
  @Input() group!: Group;
  @Input() channel!: Channel;

  channelName: string = '';
  channelMembers: string = '';

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.channelName = this.channel.name;
    this.channelMembers = this.channel.members.join(',');
  }

  updateChannel() {
    if (this.channelName !== '') {
      const membersList = this.channelMembers
        .split(',')
        .map((member) => Number(member));

      const channelsCopy = [...this.group.channels];
      const channelIndex = this.group.channels.findIndex(
        (channel) => channel.id === this.channel.id
      );

      channelsCopy[channelIndex] = {
        id: this.channel.id,
        name: this.channelName,
        members: membersList,
      };

      this.groupService
        .updateGroup({
          ...this.group,
          channels: channelsCopy,
        })
        .subscribe(
          (response) => {
            if (response.group) {
              this.group.channels = response.group.channels;
            } else {
              alert('failed to update channel');
            }
          },
          (error) => {
            alert('failed to update channel');
          }
        );
    }
  }

  deleteChannel() {
    const channelsCopy = [...this.group.channels];
    const channelIndex = this.group.channels.findIndex(
      (channel) => channel.id === this.channel.id
    );
    channelsCopy.splice(channelIndex);

    this.groupService
      .updateGroup({
        ...this.group,
        channels: channelsCopy,
      })
      .subscribe(
        (response) => {
          if (response.group) {
            this.group.channels = response.group.channels;
          } else {
            alert('failed to delete channel');
          }
        },
        (error) => {
          alert('failed to delete channel');
        }
      );
  }
}
