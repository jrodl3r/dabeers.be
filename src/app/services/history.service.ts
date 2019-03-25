import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { shareReplay } from 'rxjs/operators';

import { NotifyService } from './notify.service';

import { IUserHistory, IUserHistoryItem, IVotes, IVote, IBeerScores } from '../models/history';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  beerScores: IBeerScores;
  activeVotes: IVotes;
  activeVotesDoc: AngularFirestoreDocument;
  userHistory: IUserHistory;
  userHistoryDoc: AngularFirestoreDocument;
  userHistoryIndex: Array<string>;
  isLoading: Boolean = false;

  constructor(
    private afs: AngularFirestore,
    private notify: NotifyService
  ) { }

  getActiveVotes() {
    this.isLoading = true;
    this.activeVotesDoc = this.activeVotesDoc || this.afs.doc<IVotes>('history/active');
    this.activeVotesDoc.valueChanges()
      .pipe(shareReplay(1))
      .subscribe(votes => {
        this.activeVotes = votes;
        if (votes && Object.keys(votes).length) { // calc beer scores
          Object.keys(votes).forEach((beer) => {
            let score = 0;
            Object.keys(votes[`${beer}`]).forEach((uid, index) => {
              score = votes[`${beer}`][`${uid}`].vote ? score + 1 : score - 1;
              if (index === Object.keys(votes[`${beer}`]).length - 1) {
                this.beerScores = { ...this.beerScores, [`${beer}`]: score };
              }
            });
          });
        }
        this.isLoading = false;
      });
  }

  castVote(beerid: String, email: String, uid: String, vote: Boolean) {
    if (uid) {
      this.activeVotesDoc = this.activeVotesDoc || this.afs.doc<IVotes>('history/active');
      const newVote: IVote = { created: new Date(), email, uid, vote };
      this.activeVotesDoc
        .set({ ...this.activeVotes, [`${beerid}`]: { [`${uid}`]: newVote }}, { merge: true })
        .catch(error => this.notify.error('Error casting vote', error));
    }
  }

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

  addUserHistoryItem(uid: String, email: String, date: Date) {
    this.userHistoryDoc = this.afs.doc<IUserHistory>('history/users');
    const userHistorySub = this.userHistoryDoc.valueChanges()
      .subscribe(userHistory => {
        const user: IUserHistoryItem = { uid, email, lastLogin: date };
        this.userHistoryDoc
          .set({ ...userHistory, [`${uid}`]: { ...user }})
          .then(() => userHistorySub.unsubscribe())
          .catch(error => this.notify.error('Error saving user history', error));
    });
  }

  updateUserHistoryItem(uid: String, date: Date) {
    this.userHistoryDoc = this.afs.doc<IUserHistory>('history/users');
    this.userHistoryDoc
      .set({ [`${uid}`]: { lastLogin: date }}, { merge: true })
      .catch(error => this.notify.error('Error updating user history', error));
  }

  // TODO: Generate New Poll -> (+new Date).toString(36)
}
