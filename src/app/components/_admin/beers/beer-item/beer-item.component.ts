import { Component, Input } from '@angular/core';

import { IBeer } from '../../../../models/beer';

@Component({
  selector: '[app-beer-item]',
  templateUrl: './beer-item.component.html',
  styleUrls: ['./beer-item.component.scss']
})
export class BeerItemComponent {
  @Input() beer: IBeer;
}
