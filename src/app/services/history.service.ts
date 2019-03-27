import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { shareReplay } from 'rxjs/operators';

import { NotifyService } from './notify.service';

import { IUserHistory, IUserHistoryItem, IVotes, IVote } from '../models/history';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  scores: any;
  counts: any;
  userVoteMax = 6;
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
        this.calcTotals(votes);
        this.isLoading = false;
      });
  }

  castVote(beerid: String, email: String, uid: String, vote: Boolean) {
    const newVote: IVote = { created: new Date(), email, uid, vote };
    this.activeVotesDoc
      .set({ ...this.activeVotes, [`${beerid}`]: { [`${uid}`]: newVote }}, { merge: true })
      .catch(error => this.notify.error('Error casting vote', error));
  }

  undoVote(beerid: String, uid: String, vote: Boolean) {
    delete this.activeVotes[`${beerid}`][`${uid}`];
    this.scores[`${beerid}`] = vote
      ? this.scores[`${beerid}`] - 1
      : this.scores[`${beerid}`] + 1;
    if (this.scores[`${beerid}`] === 0 || Object.keys(this.activeVotes[`${beerid}`]).length === 0) {
      delete this.scores[`${beerid}`];
      delete this.activeVotes[`${beerid}`];
      this.calcTotals(this.activeVotes);
    }
    this.activeVotesDoc
      .set({ ...this.activeVotes })
      .catch(error => this.notify.error('Error undoing vote', error));
  }

  calcTotals(votes: IVotes) {
    if (votes && Object.keys(votes).length) {
      Object.keys(votes).forEach(beerid => {
        let score = 0;
        if (Object.keys(votes[`${beerid}`]).length) {
          this.counts = this.counts || {};
          this.counts[`${beerid}`] = Object.keys(votes[`${beerid}`]).length;
        }
        Object.keys(votes[`${beerid}`]).forEach((uid, index) => {
          score = votes[`${beerid}`][`${uid}`].vote ? score + 1 : score - 1;
          if (index === Object.keys(votes[`${beerid}`]).length - 1) {
            this.scores = { ...this.scores, [`${beerid}`]: score };
          }
        });
      });
    }
  }

  getUserVoteCount(uid: String) {
    if (this.activeVotes && Object.keys(this.activeVotes).length) {
      let count = 0;
      Object.keys(this.activeVotes).forEach(beerid => {
        Object.keys(this.activeVotes[`${beerid}`]).forEach((userId, index) => {
          if (uid === userId) {
            count = count + 1;
            return;
          }
        });
      });
      return count;
    }
    return 0;
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
