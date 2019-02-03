import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  user: any = null;

  constructor(public auth: AuthService) { }

  ngOnInit() {
    this.auth.redirectAfterSignIn();
    this.userSub = this.auth.user.subscribe(user => {
      this.user = user ? user : null;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.user = null;
  }

}
