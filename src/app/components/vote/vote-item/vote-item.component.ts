import { Component, Input } from '@angular/core';

import { AuthService } from '../../../services/auth.service';
import { VoteService } from '../../../services/vote.service';

import { IBeer } from '../../../models/beers';

@Component({
  selector: '[app-vote-item]',
  templateUrl: './vote-item.component.html',
  styleUrls: ['./vote-item.component.scss']
})
export class VoteItemComponent {
  @Input() uid: String;
  @Input() isLoggedIn: Boolean;
  @Input() beer: IBeer;

  constructor(public voteService: VoteService) { }

  castVote(beer, vote) {
    this.voteService.castVote(beer, vote);
  }

  undoVote(beer) {
    this.voteService.undoVote(beer);
  }

}
