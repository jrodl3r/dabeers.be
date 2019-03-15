import { Component, OnInit, Input } from '@angular/core';

import { BeersService } from '../../services/beers.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {
  @Input() user;

  constructor(public beersService: BeersService) { }

  ngOnInit() {
    this.beersService.getBeers();
  }

}
