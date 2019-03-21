import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { shareReplay } from 'rxjs/operators';

import { NotifyService } from './notify.service';

import { IBeer, IBeers } from '../models/beers';

@Injectable({
  providedIn: 'root'
})
export class BeersService {
  beersDoc: AngularFirestoreDocument<IBeers>;
  beers: IBeer[] = [];
  activeBeer: IBeer = {
    title: '',
    description: '',
    image: '',
    created: new Date(null),
    edited: new Date(null),
    isActive: false
  };
  activeBeerIndex: number;
  isLoading: Boolean = false;

  constructor(
    private afs: AngularFirestore,
    private notify: NotifyService
  ) {
    this.isLoading = true;
    this.beersDoc = this.afs.doc<IBeers>('catalog/beers');
    this.beersDoc.valueChanges()
      .pipe(shareReplay(1))
      .subscribe(beers => {
        this.beers = beers.items;
        this.isLoading = false;
      });
  }

  public createBeer(title: String, description: String, image: String) {
    const beer: IBeer = {
      title,
      description,
      image,
      created: new Date(),
      edited: new Date(null),
      isActive: true
    };
    this.beers.unshift(beer);
    return this.updateBeers();
  }

  public removeBeer() {
    this.beers[this.activeBeerIndex].isActive = false;
    return this.updateBeers();
  }

  public restoreBeer(index: number) {
    this.beers[index].isActive = true;
    return this.updateBeers();
  }

  public setActiveBeer(index: number) {
    this.activeBeerIndex = index;
    this.activeBeer = this.beers[this.activeBeerIndex];
  }

  public editBeer(title: String, description: String) {
    this.beers[this.activeBeerIndex].title = title;
    this.beers[this.activeBeerIndex].description = description;
    this.beers[this.activeBeerIndex].edited = new Date();
    return this.updateBeers()
      .then(() => this.notify.success('Beer updated successfully'));
  }

  private updateBeers() {
    return this.beersDoc.set({ items: this.beers })
      .catch(error => this.notify.error(error));
  }

}
