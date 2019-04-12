import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

import { NotifyService } from './notify.service';

import { IBeers, IBeer } from '../models/beer';

@Injectable({
  providedIn: 'root'
})
export class BeersService implements OnDestroy {
  beersDoc: AngularFirestoreDocument;
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
    this.beersDoc = this.afs.doc<IBeers>(`items/beers`);
    this.beersSub = this.beersDoc.valueChanges()
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
    return this.beersDoc.set(beers, { merge: true })
      .catch(error => this.notify.error('Error updating beer', error));
  }

  public createBeer(title: String, description: String) {
    const beer: IBeer = {
      id: 'beer-' + title.replace(/[^A-Za-z0-9]/g, '').trim().toLowerCase(),
      title: title.trim(),
      description: description.trim(),
      image: '',
      created: new Date(),
      edited: new Date(),
      isActive: true
    };
    return this.beersDoc.ref.get()
    .then(response => {
      const beers = response.data();
      beers[`${beer.id}`] = beer;
      return this.updateBeers(beers)
        .then(() => this.notify.success('Beer created successfully'));
    })
    .catch(error => this.notify.error('Error creating beer', error));
    // TODO: add new beer doc to votes collection
  }

  public editBeer(title: String, description: String) {
    return this.beersDoc.ref.get()
      .then(response => {
        const beers = response.data();
        beers[`${this.activeBeer.id}`].title = title;
        beers[`${this.activeBeer.id}`].description = description;
        beers[`${this.activeBeer.id}`].edited = new Date();
        return this.updateBeers(beers)
          .then(() => this.notify.success('Beer updated successfully'));
      })
      .catch(error => this.notify.error('Error editing beer', error));
  }

  public editBeerImage(image: String) {
    //   .set({ image }, { merge: true })
    //   .then(() => this.notify.success('Beer updated successfully'))
    //   .catch(error => this.notify.error('Error removing beer', error));
  }

  public removeBeer(id: String) {
    return this.beersDoc.ref.get()
      .then(response => {
        const beers = response.data();
        beers[`${id}`].isActive = false;
        return this.updateBeers(beers);
      })
      .catch(error => this.notify.error('Error removing beer', error));
  }

  public restoreBeer(id: String) {
    return this.beersDoc.ref.get()
      .then(response => {
        const beers = response.data();
        beers[`${id}`].isActive = true;
        return this.updateBeers(beers);
      })
      .catch(error => this.notify.error('Error restoring beer', error));
  }

  public setActiveBeer(id: String) {
    this.activeBeer = this.beers[`${id}`];
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
    return this.beers ? Object.keys(this.beers).filter(id => this.beers[`${id}`].isActive === true).length : 0;
  }

}
