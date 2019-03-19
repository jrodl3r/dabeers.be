import { Component } from '@angular/core';

// import { AuthService } from '../../../services/auth.service';
// import { SystemService } from '../../../services/system.service';
// import { NavService } from '../../../services/nav.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    // public auth: AuthService,
    // public system: SystemService,
    // public nav: NavService
  ) { }

  logout(event: Event) {
    // event.preventDefault();
    // this.auth.logout();
  }

}
