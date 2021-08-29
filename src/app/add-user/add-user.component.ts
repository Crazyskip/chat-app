import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  addUser() {
    this.userService
      .addUser({
        id: Math.floor(Math.random() * 10_000_000),
        username: this.username,
        email: this.email,
        role: this.role,
      })
      .subscribe(
        (response) => {
          if (response.user) {
            this.users.push(response.user);
          } else {
            alert('failed to add user');
          }
        },
        (error) => alert('failed to add user')
      );
  }
}
