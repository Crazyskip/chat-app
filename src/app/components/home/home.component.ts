import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { User } from '../../user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: User | undefined;
  title = 'Login';

  constructor(private authService: AuthService, private titleService: Title) {
    this.titleService.setTitle(this.title);
  }

  ngOnInit(): void {}

  login(f: NgForm) {
    const username = f.value.username;
    const password = f.value.password;
    this.authService.login(username, password);
  }
}
