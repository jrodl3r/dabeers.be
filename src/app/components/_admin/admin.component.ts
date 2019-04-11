import { Component } from '@angular/core';

import { ITabs } from '../../models/tab';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  tabs: ITabs[] = [
    { label: 'Beers', routerLink: '/admin/beers' },
    { label: 'Users', routerLink: '/admin/users' },
    { label: 'Polls', routerLink: '/admin/polls' },
    { label: 'Settings', routerLink: '/admin/settings' }
  ];
}
