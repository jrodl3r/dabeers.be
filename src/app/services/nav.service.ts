import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  isHeaderMenuExpanded: Boolean = false;
  isHeaderAccountMenuExpanded: Boolean = false;

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isHeaderMenuExpanded = !this.isHeaderMenuExpanded;
  }

  toggleAccountMenu(event: Event) {
    event.stopPropagation();
    this.isHeaderAccountMenuExpanded = !this.isHeaderAccountMenuExpanded;
  }

  collapseHeader() {
    this.isHeaderMenuExpanded = false;
    this.isHeaderAccountMenuExpanded = false;
  }

}
