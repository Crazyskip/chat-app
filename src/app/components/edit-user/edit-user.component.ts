import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  @Input() users!: User[];
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
        image: '',
        email: this.user.email,
        role: this.userRole,
      })
      .subscribe((response) => alert('Updated User'));
  }

  deleteUser() {
    this.userService.deleteUser(this.user.id).subscribe(
      (response) => {
        if (response.success) {
          const userIndex = this.users.findIndex(
            (user) => user.id === this.user.id
          );
          this.users.splice(userIndex, 1);
        } else {
          alert('failed to delete user');
        }
      },
      (error) => alert('failed to delete user')
    );
  }
}
