import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { VoteService } from '../../services/vote.service';
import { BeersService } from '../../services/beers.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnDestroy {
  userSub: Subscription;
  isLoggedIn: Boolean = false;
  uid: String;

  constructor(
    public auth: AuthService,
    public voteService: VoteService,
    public beersService: BeersService
  ) {
    this.userSub = this.auth.user.subscribe(user => {
      this.uid = user ? user.uid : '';
      this.isLoggedIn = user ? true : false;
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
