import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { HistoryService } from './../../services/history.service';
import { BeersService } from '../../services/beers.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent {

  constructor(
    public auth: AuthService,
    public history: HistoryService,
    public beersService: BeersService) { }

}
