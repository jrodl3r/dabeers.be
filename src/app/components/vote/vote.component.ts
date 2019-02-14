import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';

import { BeersService } from '../../services/beers.service';

import { IBeer } from '../../models/beers';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit, OnDestroy {
  @Input() user;
  beersSub: Subscription;
  beers: IBeer[] | null;
  isLoading: BehaviorSubject<Boolean>;

  constructor(public beersService: BeersService) { }

  ngOnInit() {
    this.isLoading = new BehaviorSubject<Boolean>(true);
    this.beersSub = this.beersService.getBeers().subscribe(data => {
      this.beers = data ? data.items : [];
      this.isLoading.next(false);
    });
  }

  ngOnDestroy() {
    this.beersSub.unsubscribe();
  }

}
