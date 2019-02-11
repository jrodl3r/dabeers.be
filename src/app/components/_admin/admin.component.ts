import { Component } from '@angular/core';

import { ITabs } from '../../models/tabs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  tabs: ITabs[] = [
    { label: 'Beers', routerLink: '/admin/beers' },
    { label: 'Users', routerLink: '/admin/users' },
    { label: 'History', routerLink: '/admin/history' }
  ];

  constructor() { }

}
