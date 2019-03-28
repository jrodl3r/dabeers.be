import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { shareReplay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { NotifyService } from './notify.service';

import { IPoll, IVoteList, IVote } from '../models/vote';

@Injectable({
  providedIn: 'root'
})
export class VoteService implements OnDestroy {
  scores: any;
  counts: any;
  voters: any;
  voteMax = 6;
  activePoll: IPoll;
  activePollSub: Subscription;
  activePollDoc: AngularFirestoreDocument;
  isLoading: Boolean = false;

  constructor(
    private afs: AngularFirestore,
    private notify: NotifyService
  ) {
    this.isLoading = true;
    this.activePollDoc = this.afs.doc<IPoll>('polls/active');
    this.activePollSub = this.activePollDoc.valueChanges()
      .pipe(shareReplay(1))
      .subscribe(votes => {
        this.activePoll = votes;
        this.calcTotals(votes);
      },
      error => this.notify.error('Error fetching votes', error),
      () => this.isLoading = false);
  }

  ngOnDestroy() {
    this.activePollSub.unsubscribe();
  }

  calcTotals(votes: IVoteList) {
    if (votes && Object.keys(votes).length) {
      this.voters = this.voters || {};
      this.counts = this.counts || {};
      Object.keys(votes).forEach(id => {
        let score = 0;
        if (Object.keys(votes[`${id}`]).length) {
          this.voters[`${id}`] = [];
          this.counts[`${id}`] = Object.keys(votes[`${id}`]).length;
        } else {
          this.scores = { ...this.scores, [`${id}`]: score };
          delete this.counts[`${id}`];
        }
        Object.keys(votes[`${id}`]).forEach((uid, index) => {
          const email = /(.*)?\.(.*)?@/.exec(votes[`${id}`][`${uid}`].email.toString()) || [];
          if (email.length) {
            const fname = `${email[1].toUpperCase().charAt(0)}${email[1].toLowerCase().substring(1, email[1].length)}`;
            const lname = ` ${email[2].toUpperCase().charAt(0)}.`;
            this.voters[`${id}`].push(fname + lname);
          }
          score = votes[`${id}`][`${uid}`].vote ? score + 1 : score - 1;
          if (index === Object.keys(votes[`${id}`]).length - 1) {
            this.scores = { ...this.scores, [`${id}`]: score };
          }
        });
      });
    }
  }

  castVote(id: String, email: String, uid: String, vote: Boolean) {
    const ballot: IVote = { created: new Date(), email, uid, vote };
    this.activePollDoc
      .set({ ...this.activePoll, [`${id}`]: { [`${uid}`]: ballot }}, { merge: true })
      .catch(error => this.notify.error('Error casting vote', error));
  }

  undoVote(id: String, uid: String, vote: Boolean) {
    this.activePollDoc
      .update({ [`${id}.${uid}`]: firebase.firestore.FieldValue.delete() })
      .catch(error => this.notify.error('Error undoing vote', error));
  }

  getVoteCount(uid: String) {
    if (this.activePoll && Object.keys(this.activePoll).length) {
      let count = 0;
      Object.keys(this.activePoll).forEach(beerid => {
        Object.keys(this.activePoll[`${beerid}`]).forEach(id => count = id === uid ? count + 1 : count);
      });
      return count;
    }
    return 0;
  }

  // TODO: Generate New Poll -> (+new Date).toString(36)

}
