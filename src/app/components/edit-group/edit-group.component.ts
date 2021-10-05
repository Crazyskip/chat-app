import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Group } from '../../group';
import { GroupService } from '../../services/group.service';
import { User } from '../../user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css'],
})
export class EditGroupComponent implements OnInit {
  user: User | undefined;
  assistants: any[] = [];
  members: any[] = [];

  group!: Group;
  groupName: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.getGroup();
  }

  getGroup() {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.groupService.getGroup(id).subscribe((response) => {
      this.group = response.group;
      this.groupName = this.group.name;
      if (!this.isAuthorised()) this.router.navigateByUrl('/groups');
      if (this.group) this.getUsers();
    });
  }

  getUsers() {
    this.userService.getUsers().subscribe((response) => {
      if (response.users) {
        response.users.forEach((user) => {
          if (user.role !== 'super admin' && user.role !== 'group admin') {
            this.assistants.push({
              ...user,
              selected: this.group.assistants.includes(user.id),
            });
            this.members.push({
              ...user,
              selected: this.group.members.includes(user.id),
            });
          }
        });
      }
    });
  }

  updateGroup() {
    if (this.group.name !== '') {
      const assistantIds: number[] = [];
      const memberIds: number[] = [];
      this.assistants.forEach((assistant) => {
        if (assistant.selected) assistantIds.push(assistant.id);
      });
      this.members.forEach((member) => {
        if (member.selected) memberIds.push(member.id);
      });

      const updatedGroup = {
        _id: this.group._id,
        name: this.groupName,
        assistants: assistantIds,
        members: memberIds,
        channels: this.group.channels,
      };

      this.groupService.updateGroup(updatedGroup).subscribe(
        (response) => {
          if (response.group) {
            this.group = { ...updatedGroup };
            alert('Updated Group');
            location.reload();
          }
        },
        (error) => {
          alert('failed to update group');
        }
      );
    }
  }

  isAuthorised(): boolean {
    if (this.user && this.group) {
      if (
        this.authService.isAdmin() ||
        this.group.assistants.includes(this.user.id)
      ) {
        return true;
      }
    }
    return false;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
