import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Group } from '../../group';
import { GroupService } from '../../services/group.service';
import { User } from '../../user';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css'],
})
export class EditGroupComponent implements OnInit {
  user: User | undefined;

  group!: Group;

  groupName: string = '';
  groupAssistants: string = '';
  groupMembers: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private authService: AuthService
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
      this.groupAssistants = this.group.assistants.join(',');
      this.groupMembers = this.group.members.join(',');
      if (!this.isAuthorised()) this.router.navigateByUrl('/groups');
    });
  }

  updateGroup() {
    if (this.group.name !== '') {
      const assistantsList = this.groupAssistants
        .split(',')
        .map((assistant) => Number(assistant));

      const membersList = this.groupMembers
        .split(',')
        .map((member) => Number(member));

      this.groupService
        .updateGroup({
          _id: this.group._id,
          name: this.groupName,
          assistants: assistantsList,
          members: membersList,
          channels: this.group.channels,
        })
        .subscribe(
          (response) => {
            if (response.group) {
              this.group = response.group;
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
