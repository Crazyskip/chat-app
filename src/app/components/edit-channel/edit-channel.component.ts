import { Component, OnInit, Input } from '@angular/core';
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

      this.groupService
        .updateChannel(
          this.group.id,
          this.channel.id,
          this.channelName,
          membersList
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
    this.groupService.deleteChannel(this.group.id, this.channel.id).subscribe(
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
