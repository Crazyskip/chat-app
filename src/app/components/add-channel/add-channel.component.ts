import { Component, OnInit, Input } from '@angular/core';
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
  members: string = '';

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {}

  addChannel() {
    if (this.channelName !== '') {
      const membersList = this.members
        .split(',')
        .map((member) => Number(member));

      const newChannel = {
        id: Math.floor(Math.random() * 10_000_000),
        name: this.channelName,
        members: membersList,
        messages: [],
      };

      this.groupService.addChannel(this.group._id, newChannel).subscribe(
        (response) => {
          console.log(response);
          this.group.channels.push({ ...newChannel });
        },
        (error) => {
          alert('failed to add channel');
        }
      );

      this.channelName = '';
      this.members = '';
    }
  }
}
