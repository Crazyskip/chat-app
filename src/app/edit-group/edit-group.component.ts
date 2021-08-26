import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { Group } from '../group';
import { GroupService } from '../group.service';
import { User } from '../user';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css'],
})
export class EditGroupComponent implements OnInit {
  user: User | undefined;

  group: Group | undefined;

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
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.groupService.getGroup(id).subscribe((response) => {
      this.group = response.group;
      if (!this.authorised()) this.router.navigateByUrl('/groups');
    });
  }

  authorised(): boolean {
    if (
      this.user &&
      this.group &&
      (this.user.role === 'super admin' ||
        this.user.role === 'group admin' ||
        this.group.assistant === this.user.id)
    ) {
      return true;
    }
    return false;
  }
}
