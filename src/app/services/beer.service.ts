import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { NotifyService } from './notify.service';

import { IBeers, IBeer } from '../models/beer';

@Injectable({
  providedIn: 'root'
})
export class BeerService implements OnDestroy {
  beersDoc: AngularFirestoreDocument<IBeers>;
  beersSub: Subscription;
  beers: IBeers = {};
  activeBeer: IBeer;
  isLoading: Boolean = false;

  constructor(
    private afs: AngularFirestore,
    private notify: NotifyService
  ) {
    this.resetActiveBeer();
    this.isLoading = true;
    this.beersDoc = this.afs.doc<IBeers>('items/beers');
    this.beersSub = this.beersDoc.valueChanges()
      .pipe(shareReplay(1))
      .subscribe(beers => {
        this.beers = beers;
        this.isLoading = false;
      },
      error => {
        this.notify.error('Error fetching beers', error);
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.beersSub.unsubscribe();
  }

  private updateBeers(beers: IBeers) {
    return this.beersDoc.set(beers)
      .catch(error => this.notify.error('Error updating beer', error));
  }

  public createBeer() {
    const beer: IBeer = {
      id: 'beer-' + this.activeBeer.title.replace(/[^A-Za-z0-9]/g, '').trim().toLowerCase(),
      title: this.activeBeer.title.trim(),
      description: this.activeBeer.description.trim(),
      image: this.activeBeer.image,
      created: new Date(),
      edited: new Date(),
      isActive: true
    };
    return this.beersDoc.ref.get()
      .then(response => {
        const beers = response.data();
        beers[`${beer.id}`] = beer;
        return this.updateBeers(beers)
          .then(() => {
            this.resetActiveBeer();
            this.notify.success('Beer created');
          });
      })
      .catch(error => this.notify.error('Error creating beer', error));
    // TODO: add new beer doc to votes collection
  }

  public editBeer() {
    return this.beersDoc.ref.get()
      .then(response => {
        const beers = response.data();
        beers[`${this.activeBeer.id}`].title = this.activeBeer.title;
        beers[`${this.activeBeer.id}`].description = this.activeBeer.description;
        beers[`${this.activeBeer.id}`].image = this.activeBeer.image;
        beers[`${this.activeBeer.id}`].edited = new Date();
        return this.updateBeers(beers)
          .then(() => {
            this.resetActiveBeer();
            this.notify.success('Beer updated');
          });
      })
      .catch(error => this.notify.error('Error editing beer', error));
  }

  public removeBeer(id: String) {
    return this.beersDoc.ref.get()
      .then(response => {
        const beers = response.data();
        beers[`${id}`].isActive = false;
        this.activeBeer.isActive = false;
        this.notify.warn('Beer disabled');
        return this.updateBeers(beers);
      })
      .catch(error => this.notify.error('Error removing beer', error));
  }

  public restoreBeer(id: String) {
    return this.beersDoc.ref.get()
      .then(response => {
        const beers = response.data();
        beers[`${id}`].isActive = true;
        this.activeBeer.isActive = true;
        this.notify.success('Beer restored');
        return this.updateBeers(beers);
      })
      .catch(error => this.notify.error('Error restoring beer', error));
  }

  public setActiveBeer(id: String) {
    this.activeBeer = this.beers[`${id}`];
  }

  public setActiveBeerTitle(title: String) {
    this.activeBeer.title = title;
  }

  public setActiveBeerDescription(description: String) {
    this.activeBeer.description = description;
  }

  public setActiveBeerImage(image: String) {
    this.activeBeer.image = image ? image : this.activeBeer.image;
  }

  public resetActiveBeer() {
    this.activeBeer = {
      id: '',
      title: '',
      description: '',
      image: '',
      created: new Date(null),
      edited: new Date(null),
      isActive: false
    };
  }

  public beerCount() {
    return this.beers ? Object.keys(this.beers).length : 0;
  }

  public activeBeerCount() {
    return this.beers ? Object.keys(this.beers)
      .filter(id => this.beers[`${id}`].isActive === true).length : 0;
  }

}
