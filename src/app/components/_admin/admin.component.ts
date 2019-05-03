import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AdminService } from './admin.service';
import { BeerService } from '../../services/beer.service';

import { ITabs } from '../../models/tab';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnDestroy {
  beersSub: Subscription;
  usersSub: Subscription;
  tabs: ITabs[];

  constructor(
    public adminService: AdminService,
    public beerService: BeerService
  ) {
    this.tabs = [
      { label: 'Beers', routerLink: '/admin/beers' },
      { label: 'Users', routerLink: '/admin/users' },
      { label: 'Polls', routerLink: '/admin/polls' },
      { label: 'Settings', routerLink: '/admin/settings' }
    ];
    this.beersSub = this.beerService.beersDoc.valueChanges()
      .subscribe(beers => this.tabs[0].count = beers ? Object.keys(beers).length : 0);
    this.usersSub = this.adminService.usersCollection.valueChanges()
      .subscribe(users => this.tabs[1].count = users ? users.length : 0);
  }

  ngOnDestroy() {
    this.beersSub.unsubscribe();
    this.usersSub.unsubscribe();
  }

}
