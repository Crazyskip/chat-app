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
    this.authService.checkLogin();
  }

  ngOnInit(): void {
    if (this.user) {
      this.groupService.getGroups(this.user).subscribe((response) => {
        this.groups = response.groups;
      });
    }
  }

  handleSelect(group: Group, channel: Channel) {
    this.selected = { group, channel };
    console.log(this.selected);
  }

  canEditGroup(group: Group): boolean {
    if (
      this.user &&
      (this.user.role === 'super admin' ||
        this.user.role === 'group admin' ||
        group.assistant === this.user.id)
    ) {
      return true;
    }
    return false;
  }

  routeEditGroup(groupID: number) {
    this.router.navigateByUrl('/group/' + groupID);
  }
}
