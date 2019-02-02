import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userSub: Subscription;
  user: any;

  constructor(public auth: AuthService) { }

  ngOnInit() {
    this.auth.redirectAfterSignIn();
    this.userSub = this.auth.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
  }
}
