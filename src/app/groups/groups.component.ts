import { Component, OnInit } from '@angular/core';
import { GroupService } from '../group.service';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Group } from '../group';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class GroupsComponent implements OnInit {
  user: User | undefined;
  groups: Group[] = [];

  constructor(
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
}
