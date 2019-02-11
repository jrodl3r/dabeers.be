import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { BeersService } from '../../services/beers.service';

import { IUser } from '../../models/user';
import { IBeer } from '../../models/beers';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit, OnDestroy {
  beersSub: Subscription;
  beers: IBeer[] | null;
  isLoading: Boolean = true;

  constructor(public beersService: BeersService) { }

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
