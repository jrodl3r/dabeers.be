import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { shareReplay, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { NotifyService } from './notify.service';

import { IBeers, IBeer } from '../models/beers';

@Injectable({
  providedIn: 'root'
})
export class BeersService implements OnDestroy {
  beersCollection: AngularFirestoreCollection<IBeer>;
  beers: Array<IBeer>;
  beersSub: Subscription;
  beersDoc: AngularFirestoreDocument<IBeer>;
  activeBeer: IBeer = {
    id: '',
    title: '',
    description: '',
    image: '',
    created: new Date(null),
    edited: new Date(null),
    isActive: false
  };
  isLoading: Boolean = false;

  constructor(
    private afs: AngularFirestore,
    private notify: NotifyService
  ) {
    this.isLoading = true;
    this.beersCollection = this.afs.collection<IBeer>('beers');
    this.beersSub = this.beersCollection.valueChanges()
      .subscribe(beers => {
        this.beers = beers;
        this.isLoading = false;
      },
      error => (() => {
        this.notify.error('Error fetching beers', error);
        this.isLoading = false;
      }));
  }

  ngOnDestroy() {
    this.beersSub.unsubscribe();
  }

  private updateBeers() {
    // return this.beersDoc.set(this.beers, { merge: true })
    //   .catch(error => this.notify.error('Error updating beer', error));
  }

  public createBeer(title: String, description: String) {
    // const beer: IBeer = {
    //   id: 'beer-' + title.replace(/[^A-Za-z0-9]/g, '').trim().toLowerCase(),
    //   title: title.trim(),
    //   description: description.trim(),
    //   image: this.beers[`${this.activeBeer.id}`].image,
    //   created: new Date(),
    //   edited: new Date(null),
    //   isActive: true
    // };
    // this.beers[`${beer.id}`] = beer;
    // return this.updateBeers();
  }

  public editBeer(title: String, description: String) {
    // this.beers[`${this.activeBeer.id}`].title = title;
    // this.beers[`${this.activeBeer.id}`].description = description;
    // this.beers[`${this.activeBeer.id}`].edited = new Date();
    // return this.updateBeers()
    //   .then(() => this.notify.success('Beer updated successfully'));
  }

  public editBeerImage(image: String) {
    // this.beers[`${this.activeBeer.id}`].image = image;
    // return this.updateBeers();
  }

  public resetActiveBeerImage() {
    // this.beers[`${this.activeBeer.id}`].image = '';
  }

  public removeBeer() {
    // this.beers[`${this.activeBeer.id}`].isActive = false;
    // return this.updateBeers();
  }

  public restoreBeer(id: String) {
    // this.beers[`${id}`].isActive = true;
    // return this.updateBeers();
  }

  public setActiveBeer(id: String) {
    // this.activeBeer = this.beers[`${id}`];
  }

  public hasBeers() {
    // return this.beers ? Object.keys(this.beers).length : false;
  }

  public activeBeerCount() {
    // return this.beers ? Object.keys(this.beers).filter(id => this.beers[`${id}`].isActive).length : 0;
  }

}
