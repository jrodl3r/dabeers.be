import { Component, Input } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: '[app-vote-item]',
  templateUrl: './vote-item.component.html',
  styleUrls: ['./vote-item.component.scss']
})
export class VoteItemComponent {
  @Input() beer: any = {};

  constructor(
    public auth: AuthService,
    public history: HistoryService) { }

}
