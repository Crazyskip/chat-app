import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Group } from '../group';
import { GroupService } from '../group.service';
import { User } from '../user';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css'],
})
export class AddGroupComponent implements OnInit {
  user: User | undefined;
  groups: Group[] = [];

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
}
