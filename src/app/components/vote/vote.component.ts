import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { BeerService } from '../../services/beer.service';
import { VoteService } from '../../services/vote.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent {

  constructor(
    public auth: AuthService,
    public beerService: BeerService,
    public voteService: VoteService
  ) { }

}
