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

  handleSelect(group: Group, channel: Channel) {
    this.selected = { group, channel };
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
