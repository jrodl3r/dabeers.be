import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { shareReplay } from 'rxjs/operators';

import { NotifyService } from './notify.service';

import { IUserHistory, IUserHistoryItem } from '../models/history';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  userHistoryDoc: AngularFirestoreDocument;
  userHistory: IUserHistory;
  userHistoryIndex: Array<string>;
  isLoading: Boolean = false;

  constructor(
    private afs: AngularFirestore,
    private notify: NotifyService
  ) { }

  getUserHistory() {
    this.isLoading = true;
    this.userHistoryDoc = this.userHistoryDoc || this.afs.doc<IUserHistory>('history/users');
    this.userHistoryDoc.valueChanges()
      .pipe(shareReplay(1))
      .subscribe(userHistory => {
        this.userHistory = userHistory;
        this.userHistoryIndex = Object.keys(this.userHistory);
        this.isLoading = false;
      });
  }

  addUser(uid: String, email: String, date: Date) {
    this.userHistoryDoc = this.afs.doc<IUserHistory>('history/users');
    const userHistorySub = this.userHistoryDoc.valueChanges()
      .subscribe(userHistory => {
        const user: IUserHistoryItem = { email, lastLogin: date };
        userHistory = { ...userHistory, [`${uid}`]: { ...user }};
        this.userHistoryDoc
          .set(userHistory)
          .then(() => userHistorySub.unsubscribe())
          .catch(error => this.notify.error('Error saving user history', error));
    });
  }

  updateUserLoginDate(uid: String, date: Date) {
    this.userHistoryDoc = this.afs.doc<IUserHistory>('history/users');
    this.userHistoryDoc
      .set({ [`${uid}`]: { lastLogin: date }}, { merge: true })
      .catch(error => this.notify.error('Error updating user history', error));
  }

}
