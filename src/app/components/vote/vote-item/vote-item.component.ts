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
  @Input() beer: IBeer;
  @Input() isLoggedIn: Boolean;

  constructor(
    private auth: AuthService,
    public voteService: VoteService) { }

  castVote(beer, vote) {
    this.voteService.castVote(beer, this.auth.getUserEmail(), this.auth.getUserID(), vote);
  }

  undoVote(beer) {
    this.voteService.undoVote(beer, this.auth.getUserID());
  }

}
