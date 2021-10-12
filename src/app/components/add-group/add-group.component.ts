import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Group } from '../../group';
import { GroupService } from '../../services/group.service';
import { User } from '../../user';
import { UserService } from 'src/app/services/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css'],
})
export class AddGroupComponent implements OnInit {
  user: User | undefined;
  groups: Group[] = [];
  users: User[] = [];

  assistants: any[] = [];
  members: any[] = [];

  groupName: string = '';

  constructor(
    private router: Router,
    private groupService: GroupService,
    private authService: AuthService,
    private userService: UserService,
    private titleService: Title
  ) {
    // Set title of page
    this.titleService.setTitle('Add Group');

    this.user = this.authService.getUser();
    if (!this.user) this.router.navigateByUrl('/home');
    if (!this.authService.isAdmin()) this.router.navigateByUrl('/groups');
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe((response) => {
      if (response.users) {
        this.users = response.users;
        response.users.forEach((user) => {
          if (user.role !== 'super admin' && user.role !== 'group admin') {
            this.assistants.push({ ...user, selected: false });
            this.members.push({ ...user, selected: false });
          }
        });
      }
    });
  }

  // Sends add group
  addGroup() {
    if (this.groupName !== '') {
      const assistantIds: number[] = [];
      const memberIds: number[] = [];
      this.assistants.forEach((assistant) => {
        if (assistant.selected) assistantIds.push(assistant.id);
      });
      this.members.forEach((member) => {
        if (member.selected) memberIds.push(member.id);
      });

      const newGroup = {
        _id: '',
        name: this.groupName,
        assistants: assistantIds,
        members: memberIds,
        channels: [],
      };

      this.groupService.addGroup(newGroup).subscribe(
        (response) => {
          // If added clear all data entered
          if (response.group) {
            this.groupName = '';
            this.assistants.forEach((assistant) => {
              if (assistant.selected) assistant.selected = false;
            });
            this.members.forEach((member) => {
              if (member.selected) member.selected = false;
            });
            alert('Group Added');
          } else {
            alert('Failed to add Group');
          }
        },
        (error) => {
          alert('Failed to add Group');
        }
      );
    } else {
      alert('Invalid group name');
    }
  }
}
