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

  constructor(
    public auth: AuthService,
    public voteService: VoteService) { }

  undoVote(beer, uid) {
    // this.voteService.undoVote(beer, uid, this.voteService.activePoll[beer][uid].vote);
  }

}
