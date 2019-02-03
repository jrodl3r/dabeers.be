import { Component, OnInit, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @HostBinding('class.loading')
  @HostBinding('class.active') isLoading: Boolean = false;

  userSub: Subscription;

  constructor(public auth: AuthService) { }

  ngOnInit() {
    this.userSub = this.auth.user.subscribe(user => {
      if (user === null && !this.auth.isLoggedIn() || typeof user === 'object' && !!user) {
        this.isLoading = false;
        return;
      }
      this.isLoading = true;
    });
  }

}
