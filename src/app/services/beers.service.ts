import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { NotifyService } from './notify.service';

import { IBeer, IBeers } from '../models/beers';

@Injectable({
  providedIn: 'root'
})
export class BeersService {
  beersDoc: AngularFirestoreDocument<IBeers>;

  constructor(
    private afs: AngularFirestore,
    private notify: NotifyService) { }

  public getBeers(): Observable<IBeers> {
    this.beersDoc = this.afs.doc<IBeers>('catalog/beers');
    return this.beersDoc.valueChanges();
  }

  public updateBeers(beers: IBeer[]) {
    this.beersDoc.set({ items: beers })
      .catch(error => this.notify.error(error));
  }
}
