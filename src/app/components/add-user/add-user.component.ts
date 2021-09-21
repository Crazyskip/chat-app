import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../user';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  @Input() users!: User[];

  username: string = '';
  email: string = '';
  role: string = 'member';
  image: File | undefined;

  constructor(private userService: UserService, private http: HttpClient) {}

  ngOnInit(): void {}

  fileChosen(event: any) {
    if (event.target.value) {
      this.image = event.target.files[0];
    }
  }

  addUser() {
    if (this.users.find((user) => user.username === this.username)) {
      alert('User already exists with that username');
    } else {
      const formData = new FormData();
      if (this.image) {
        formData.append('id', `${Math.floor(Math.random() * 10_000_000)}`);
        formData.append('username', this.username);
        formData.append('profileImage', this.image);
        formData.append('email', this.email);
        formData.append('role', this.role);
      }
      this.userService.addUser(formData).subscribe(
        (response) => {
          if (response.user) {
            this.users.push(response.user);
            this.username = '';
            this.email = '';
            this.role = 'member';
          } else {
            alert('failed to add user');
          }
        },
        (error) => alert('failed to add user')
      );
    }
  }
}
