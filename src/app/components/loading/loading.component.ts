import { Component, OnInit, HostBinding } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { SystemService } from '../../services/system.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @HostBinding('class.disabled') isDisabled: Boolean = false;

  constructor(
    public auth: AuthService,
    public system: SystemService
  ) { }

  ngOnInit() {
    if (this.system.isBrowser()) {
      this.auth.user.subscribe(user => {
        if (user === null && !this.auth.isLoggedIn() || typeof user === 'object' && user.hasOwnProperty('isActive') && user.isActive) {
          setTimeout(() => this.isDisabled = true, 500);
          return;
        }
        this.isDisabled = false;
      });
    }
  }

}
