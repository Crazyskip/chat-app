import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: User | undefined;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  login(f: NgForm) {
    const username = f.value.username;
    this.authService.login(username);
  }
}
