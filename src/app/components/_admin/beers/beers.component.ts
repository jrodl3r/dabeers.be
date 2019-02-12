import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';

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
  activeBeer: IBeer;
  activeBeerIndex: number;
  isLoading: BehaviorSubject<Boolean>;
  isRemoveModalActive: BehaviorSubject<Boolean>;

  constructor(private beersService: BeersService) { }

  ngOnInit() {
    this.isLoading = new BehaviorSubject<Boolean>(true);
    this.isRemoveModalActive = new BehaviorSubject<Boolean>(false);
    this.beersSub = this.beersService.getBeers().subscribe(data => {
      this.beers = data ? data.items : [];
      this.isLoading.next(false);
    });
  }

  ngOnDestroy() {
    this.beersSub.unsubscribe();
  }

  showRemoveBeerModal(index: number) {
    this.activeBeer = this.beers[index];
    this.activeBeerIndex = index;
    this.isRemoveModalActive.next(true);
  }

  hideRemoveBeerModal() {
    this.isRemoveModalActive.next(false);
  }

  removeBeer() {
    this.beers[this.activeBeerIndex].isActive = false;
    this.beersService.updateBeers(this.beers)
      .then(() => this.isRemoveModalActive.next(false));
  }

}
