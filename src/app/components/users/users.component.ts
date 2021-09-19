import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  currentUser: User | undefined;

  users: User[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.currentUser = this.authService.getUser();
    if (!this.currentUser) this.router.navigateByUrl('/home');
    if (!this.authService.isSuperAdmin()) this.router.navigateByUrl('/groups');
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe((response) => {
      this.users = response.users;
    });
  }
}
