import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { BeersService } from '../../../services/beers.service';

import { IBeer } from '../../../models/beers';

@Component({
  selector: 'app-beers',
  templateUrl: './beers.component.html',
  styleUrls: ['./beers.component.scss']
})
export class BeersComponent implements OnInit, OnDestroy {
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
