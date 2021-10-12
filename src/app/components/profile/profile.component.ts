import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
    private userService: UserService,
    private titleService: Title
  ) {
    // Set title of page
    this.titleService.setTitle('Profile');

    this.user = this.authService.getUser();
  }

  ngOnInit(): void {}

  // Sends update profile
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

  // Return current user image
  getUserImage(): string {
    if (!this.user || this.user.image === undefined) {
      return 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.business2community.com%2Fsocial-media%2Fimportance-profile-picture-career-01899604&psig=AOvVaw2r9JswSUqXnniJ6VNAi5cs&ust=1634002103217000&source=images&cd=vfe&ved=0CAgQjRxqFwoTCNiKv6iawfMCFQAAAAAdAAAAABAS';
    }
    return `http://localhost:3000/images/${this.user.image}`;
  }
}
