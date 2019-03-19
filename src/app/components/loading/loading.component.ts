import { Component, OnInit, HostBinding } from '@angular/core';
// import { Subscription } from 'rxjs';

// import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @HostBinding('class.disabled') disabled: Boolean = false;

  // userSub: Subscription;

  // constructor(public auth: AuthService) {
  constructor() {
    if (typeof window !== 'undefined') { // TODO: Change to system.isBrowser()
      setTimeout(() => this.disabled = true, 500);
    }
  }

  ngOnInit() {
    // this.userSub = this.auth.user.subscribe(user => {
    //   if (user === null && !this.auth.isLoggedIn() || typeof user === 'object' && !!user) {
    //     this.isDisabled = false;
    //     return;
    //   }
    //   this.isDisabled = true;
    // });
  }

}
