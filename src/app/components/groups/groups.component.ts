import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../user';
import { Group } from '../../group';
import { Channel } from '../../channel';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class GroupsComponent implements OnInit {
  user: User;
  groups: Group[] = [];

  selected: { group: Group; channel: Channel } | undefined;

  constructor(
    private router: Router,
    private groupService: GroupService,
    private authService: AuthService,
    private titleService: Title
  ) {
    // Set title of page
    this.titleService.setTitle('Groups');

    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.groupService.getGroups().subscribe((response) => {
      this.groups = this.filterUserGroups(response.groups);
    });
  }

  private filterUserGroups(allGroups: Group[]): Group[] {
    // Get all groups and channels for admins
    if (this.authService.isAdmin()) {
      return allGroups;
    } else {
      return allGroups.filter(
        (group) =>
          // Filter for in group
          group.assistants.includes(this.user.id) ||
          group.members.includes(this.user.id)
      );
    }
  }

  deleteGroup(_id: string) {
    this.groupService.deleteGroup(_id).subscribe(
      (response) => {
        // If deleted remove group from list
        if (response.success) {
          const groupIndex = this.groups.findIndex(
            (group) => group._id === _id
          );
          this.selected = undefined;
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

  // Returns if current user can edit group
  canEditGroup(group: Group): boolean {
    if (this.authService.isAdmin() || group.assistants.includes(this.user.id)) {
      return true;
    }
    return false;
  }

  // Routes to selected group
  routeEditGroup(_id: string) {
    this.router.navigateByUrl('/groups/edit/' + _id);
  }
}
