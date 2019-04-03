import { Component, Input, Output, EventEmitter } from '@angular/core';

import { IBeer } from '../../../../models/beer';

@Component({
  selector: '[app-beer-item]',
  templateUrl: './beer-item.component.html',
  styleUrls: ['./beer-item.component.scss']
})
export class BeerItemComponent {
  @Input() beer: IBeer;
  @Output() editBeer = new EventEmitter<String>();
  @Output() removeBeer = new EventEmitter<String>();
  @Output() restoreBeer = new EventEmitter<String>();

  emitEditBeer(id: String) {
    this.editBeer.emit(id);
  }

  emitRemoveBeer(id: String) {
    this.removeBeer.emit(id);
  }

  emitRestoreBeer(id: String) {
    this.restoreBeer.emit(id);
  }

}
