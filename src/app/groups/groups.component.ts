import { Component, OnInit } from '@angular/core';
import { GroupService } from '../group.service';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Group } from '../group';
import { Channel } from '../channel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class GroupsComponent implements OnInit {
  user: User | undefined;
  groups: Group[] = [];

  message: string = '';

  selected: { group: Group; channel: Channel } | undefined;

  constructor(
    private router: Router,
    private groupService: GroupService,
    private authService: AuthService
  ) {
    this.authService.currentUserChange.subscribe((value) => {
      this.user = value;
    });
    this.user = this.authService.getUser();
    if (!this.user) this.router.navigateByUrl('/home');
  }

  ngOnInit(): void {
    this.groupService.getGroups().subscribe((response) => {
      // Get all groups and channels for admins
      if (this.authService.isAdmin()) {
        this.groups = response.groups;
      } else {
        this.groups = response.groups
          .filter(
            (group) =>
              // Filter for in group
              this.user &&
              (group.assistants.includes(this.user.id) ||
                group.members.includes(this.user.id))
          )
          .map((group) => {
            // Get all channels for group assistants
            if (this.user && group.assistants.includes(this.user.id)) {
              return group;
            } else {
              // Filter channels for members
              return {
                ...group,
                channels: group.channels.filter(
                  (channel) =>
                    this.user && channel.members.includes(this.user.id)
                ),
              };
            }
          });
      }
    });
  }

  deleteGroup(groupID: number) {
    this.groupService.deleteGroup(groupID).subscribe(
      (response) => {
        if (response.success) {
          const groupIndex = this.groups.findIndex(
            (group) => group.id === groupID
          );
          this.groups.splice(groupIndex, 1);
        } else {
          alert('failed to delete group');
        }
      },
      (error) => {
        alert('failed to delete group');
      }
    );
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  handleSelect(group: Group, channel: Channel) {
    this.selected = { group, channel };
  }

  sendMessage() {
    if (this.selected && this.user) {
      this.groupService
        .addMessage(
          this.selected.group.id,
          this.selected.channel.id,
          this.user.id,
          this.message
        )
        .subscribe(
          (response) => {
            if (response.success && this.user && this.selected) {
              this.selected.channel.messages.push({
                user: response.message.user,
                message: response.message.message,
              });
              this.message = '';
            } else {
              alert('Failed to send message');
            }
          },
          (error) => alert('Failed to send message')
        );
    }
  }

  canEditGroup(group: Group): boolean {
    if (
      this.user &&
      (this.user.role === 'super admin' ||
        this.user.role === 'group admin' ||
        group.assistants.includes(this.user.id))
    ) {
      return true;
    }
    return false;
  }

  routeEditGroup(groupID: number) {
    this.router.navigateByUrl('/groups/' + groupID);
  }
}
