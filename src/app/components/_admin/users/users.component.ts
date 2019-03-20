import { Component, OnInit } from '@angular/core';

import { HistoryService } from '../../../services/history.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(
    public history: HistoryService
  ) { }

  ngOnInit() {
    this.history.getUserHistory();
  }

}
