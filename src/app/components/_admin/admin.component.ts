import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { BeersService } from '../../services/beers.service';

import { IBeer } from '../../models/beers';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  beersSub: Subscription;
  beers: IBeer[] | null;
  isLoading: Boolean = true;

  constructor(private beersService: BeersService) { }

  ngOnInit() {
    this.beersSub = this.beersService.getBeers().subscribe(data => {
      this.beers = data ? data.items : [];
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.beersSub.unsubscribe();
  }

}
