import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { shareReplay } from 'rxjs/operators';

import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  userHistoryDoc: AngularFirestoreDocument;
  userHistory: any;
  userHistoryKeys: Array<string>;

  constructor(
    private afs: AngularFirestore,
    private notify: NotifyService
  ) { }

  getUserHistory() {
    this.userHistoryDoc = this.userHistoryDoc || this.afs.doc('history/users');
    this.userHistoryDoc.valueChanges()
      .pipe(shareReplay(1))
      .subscribe(userHistory => {
        this.userHistory = userHistory;
        this.userHistoryKeys = Object.keys(this.userHistory);
      });
  }

  addUser(uid: string, email: String, date: Date) {
    this.userHistoryDoc = this.afs.doc('history/users');
    const userHistorySub = this.userHistoryDoc.valueChanges()
      .subscribe(userHistory => {
        const user = { email, lastLogin: date };
        userHistory = { ...userHistory, [uid]: { ...user }};
        this.userHistoryDoc
          .set(userHistory)
          .then(() => userHistorySub.unsubscribe())
          .catch(error => this.notify.error('Error saving user history', error));
    });
  }

  updateUserLoginDate(uid: string, date: Date) {
    this.userHistoryDoc = this.afs.doc('history/users');
    this.userHistoryDoc
      .set({ [uid]: { lastLogin: date }}, { merge: true })
      .catch(error => this.notify.error('Error updating user history', error));
  }

}
