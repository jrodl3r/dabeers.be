import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

import { NotifyService } from './notify.service';

import { IBeer, IBeers } from '../models/beers';

@Injectable({
  providedIn: 'root'
})
export class BeersService {
  beersDoc: AngularFirestoreDocument<IBeers>;
  activeBeer: BehaviorSubject<IBeer>;

  constructor(
    private afs: AngularFirestore,
    private notify: NotifyService) {
      this.activeBeer = new BehaviorSubject<IBeer>({
        title: '',
        description: '',
        image: '',
        created: new Date(null),
        edited: new Date(null),
        isActive: false });
    }

  public getBeers(): Observable<IBeers> {
    this.beersDoc = this.afs.doc<IBeers>('catalog/beers');
    return this.beersDoc.valueChanges();
  }

  public updateBeers(beers: IBeer[]) {
    return this.beersDoc.set({ items: beers })
      .catch(error => this.notify.error(error));
  }

  public getActiveBeer(): Observable<IBeer> {
    return this.activeBeer.asObservable();
  }

  public setActiveBeer(item: IBeer) {
    this.activeBeer.next(item);
  }
}
