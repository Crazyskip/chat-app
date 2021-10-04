import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User;
  password: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {}

  updateProfile() {
    if (this.password !== '') {
      this.userService
        .updateUser({ ...this.user, password: this.password })
        .subscribe((response) => {
          if (response.success) {
            alert('Updated Profile');
          } else {
            alert('Failed to update profile');
          }
        });
    }
  }

  getUserImage(): string {
    return `http://localhost:3000/images/${this.user.image}`;
  }
}
