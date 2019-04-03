import { Component, Input } from '@angular/core';

import { VoteService } from '../../../services/vote.service';

import { IBeer } from '../../../models/beer';

@Component({
  selector: '[app-vote-item]',
  templateUrl: './vote-item.component.html',
  styleUrls: ['./vote-item.component.scss']
})
export class VoteItemComponent {
  @Input() beer: IBeer;
  @Input() uid: String;
  @Input() isLoggedIn: Boolean;

  constructor(public voteService: VoteService) { }

  castVote(beer, vote) {
    this.voteService.castVote(beer, vote);
  }

  undoVote(beer) {
    this.voteService.undoVote(beer);
  }

}
