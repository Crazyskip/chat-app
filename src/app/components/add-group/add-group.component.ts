import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Group } from '../../group';
import { GroupService } from '../../services/group.service';
import { User } from '../../user';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css'],
})
export class AddGroupComponent implements OnInit {
  user: User | undefined;
  groups: Group[] = [];

  groupName: string = '';
  groupAssistants: string = '';
  groupMembers: string = '';

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
    if (!this.authService.isAdmin()) this.router.navigateByUrl('/groups');
  }

  ngOnInit(): void {}

  addGroup() {
    if (this.groupName !== '') {
      const newGroup = {
        id: Math.floor(Math.random() * 10_000_000),
        name: this.groupName,
        assistants: this.groupAssistants
          .split(',')
          .map((assistant) => Number(assistant)),
        members: this.groupMembers.split(',').map((member) => Number(member)),
        channels: [],
      };

      this.groupService.addGroup(newGroup).subscribe(
        (response) => {
          if (response.group) {
            this.groupName = '';
            this.groupAssistants = '';
            this.groupMembers = '';
          } else {
            alert('Failed to add Group');
          }
        },
        (error) => {
          alert('Failed to add Group');
        }
      );
    }
  }
}
