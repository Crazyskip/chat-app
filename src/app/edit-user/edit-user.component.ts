import { Component, Input, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  @Input() user!: User;

  userRole: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userRole = this.user.role;
  }

  updateUser() {
    this.userService
      .updateUser({
        id: this.user.id,
        username: this.user.username,
        email: this.user.email,
        role: this.userRole,
      })
      .subscribe((response) => console.log(response.user));
  }
}
