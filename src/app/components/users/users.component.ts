import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../user';
import { UserService } from '../../services/user.service';
import { Title } from '@angular/platform-browser';

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
    private userService: UserService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Users');
    this.currentUser = this.authService.getUser();
  }

  ngOnInit(): void {
    if (!this.currentUser) this.router.navigateByUrl('/home');
    if (!this.authService.isSuperAdmin()) this.router.navigateByUrl('/groups');
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe((response) => {
      this.users = response.users;
    });
  }
}
