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
  user: Subscription;
  isLoggedIn: Boolean = false;

  constructor(
    private auth: AuthService,
    public voteService: VoteService,
    public beersService: BeersService
  ) {
    this.user = this.auth.user.subscribe(user => this.isLoggedIn = true);
  }

  ngOnDestroy() {
    this.user.unsubscribe();
  }

}
