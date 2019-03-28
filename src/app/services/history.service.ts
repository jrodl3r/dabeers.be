import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { shareReplay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { NotifyService } from './notify.service';

import { IUserHistory, IUserHistoryItem, IVotes, IVote } from '../models/history';

@Injectable({
  providedIn: 'root'
})
export class HistoryService implements OnDestroy {
  scores: any;
  counts: any;
  voters: any;
  voteMax = 6;
  activeVotes: IVotes;
  activeVotesSub: Subscription;
  activeVotesDoc: AngularFirestoreDocument;
  userHistory: IUserHistory;
  userHistorySub: Subscription;
  userHistoryDoc: AngularFirestoreDocument;
  userHistoryIndex: Array<string>;
  isLoading: Boolean = false;

  constructor(
    private afs: AngularFirestore,
    private notify: NotifyService
  ) {
    this.isLoading = true;
    this.activeVotesDoc = this.afs.doc<IVotes>('history/active');
    this.activeVotesSub = this.activeVotesDoc.valueChanges()
      .pipe(shareReplay(1))
      .subscribe(votes => {
        this.activeVotes = votes;
        this.calcTotals(votes);
      },
      error => this.notify.error('Error fetching votes', error),
      () => this.isLoading = false);
  }

  ngOnDestroy() {
    this.activeVotesSub.unsubscribe();
    this.userHistorySub.unsubscribe();
  }

  castVote(beerid: String, email: String, uid: String, vote: Boolean) {
    const newVote: IVote = { created: new Date(), email, uid, vote };
    this.activeVotesDoc
      .set({ ...this.activeVotes, [`${beerid}`]: { [`${uid}`]: newVote }}, { merge: true })
      .catch(error => this.notify.error('Error casting vote', error));
  }

  undoVote(beerid: String, uid: String, vote: Boolean) {
    this.activeVotesDoc
      .update({ [`${beerid}.${uid}`]: firebase.firestore.FieldValue.delete() })
      .catch(error => this.notify.error('Error undoing vote', error));
  }

  calcTotals(votes: IVotes) {
    if (votes && Object.keys(votes).length) {
      this.voters = this.voters || {};
      this.counts = this.counts || {};
      Object.keys(votes).forEach(beerid => {
        let score = 0;
        if (Object.keys(votes[`${beerid}`]).length) {
          this.voters[`${beerid}`] = [];
          this.counts[`${beerid}`] = Object.keys(votes[`${beerid}`]).length;
        } else {
          this.scores = { ...this.scores, [`${beerid}`]: score };
          delete this.counts[`${beerid}`];
        }
        Object.keys(votes[`${beerid}`]).forEach((uid, index) => {
          const email = /(.*)?\.(.*)?@/.exec(votes[`${beerid}`][`${uid}`].email.toString()) || [];
          if (email.length) {
            const fname = `${email[1].toUpperCase().charAt(0)}${email[1].toLowerCase().substring(1, email[1].length)}`;
            const lname = ` ${email[2].toUpperCase().charAt(0)}.`;
            this.voters[`${beerid}`].push(fname + lname);
          }
          score = votes[`${beerid}`][`${uid}`].vote ? score + 1 : score - 1;
          if (index === Object.keys(votes[`${beerid}`]).length - 1) {
            this.scores = { ...this.scores, [`${beerid}`]: score };
          }
        });
      });
    }
  }

  getVoteCount(uid: String) {
    if (this.activeVotes && Object.keys(this.activeVotes).length) {
      let count = 0;
      Object.keys(this.activeVotes).forEach(beerid => {
        Object.keys(this.activeVotes[`${beerid}`]).forEach(id => count = id === uid ? count + 1 : count);
      });
      return count;
    }
    return 0;
  }

  getUserHistory() {
    this.isLoading = true;
    this.userHistoryDoc = this.afs.doc<IUserHistory>('history/users');
    this.userHistorySub = this.userHistoryDoc.valueChanges()
      .pipe(shareReplay(1))
      .subscribe(userHistory => {
        this.userHistory = userHistory;
        this.userHistoryIndex = Object.keys(this.userHistory);
        this.isLoading = false;
      },
      error => this.notify.error('Error fetching user history', error));
  }

  addUserHistoryItem(uid: String, email: String, date: Date) {
    const user: IUserHistoryItem = { uid, email, lastLogin: date };
    this.userHistoryDoc = this.afs.doc<IUserHistory>('history/users');
    this.userHistoryDoc
      .set({ [`${uid}`]: { ...user }})
      .catch(error => this.notify.error('Error saving user history', error));
  }

  updateUserHistoryItem(uid: String, date: Date) {
    this.userHistoryDoc = this.afs.doc<IUserHistory>('history/users');
    this.userHistoryDoc
      .set({ [`${uid}`]: { lastLogin: date }}, { merge: true })
      .catch(error => this.notify.error('Error updating user history', error));
  }

  // TODO: Generate New Poll -> (+new Date).toString(36)
}
