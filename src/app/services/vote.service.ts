import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { shareReplay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { NotifyService } from './notify.service';

import { IPoll, IVote } from '../models/vote';

@Injectable({
  providedIn: 'root'
})
export class VoteService implements OnDestroy {
  private votesCollection: AngularFirestoreCollection<IPoll>;
  votesSub: Subscription;
  polls: Array<IPoll>;
  voters: any = {};
  counts: any = {};
  scores: any = {};
  voteMax = 6;
  isLoading: Boolean = false;

  constructor(
    private afs: AngularFirestore,
    private notify: NotifyService
  ) {
    this.isLoading = true;
    this.votesCollection = this.afs.collection<IPoll>('votes');
    this.votesSub = this.votesCollection.valueChanges()
      .pipe(shareReplay(1))
      .subscribe(polls => {
        this.polls = polls;
        this.calcTotals(polls);
        this.isLoading = false;
      },
      error => (() => {
        this.notify.error('Error fetching votes', error);
        this.isLoading = false;
      }));
  }

  // copyVotes() {
    // let activePoll = {};
    // const activePollDoc = this.afs.doc('polls/active');
    // const activePollSub = activePollDoc.valueChanges()
    //   .pipe(take(1))
    //   .subscribe(votes => {
    //     activePoll = votes;
    //     Object.keys(activePoll).forEach(id => {
    //       const beer = { id, votes: activePoll[`${id}`] };
    //       this.votesCollection.doc(id).set(beer);
    //     });
    //   },
    //   error => (() => {
    //     this.notify.error('Error fetching poll', error);
    //     this.isLoading = false;
    //   }));
  // }

  ngOnDestroy() {
    this.votesSub.unsubscribe();
  }

  calcTotals(polls: IPoll[]) {
    polls.forEach(beer => {
      let score = 0;
      this.voters[`${beer.id}`] = [];
      Object.keys(beer.votes).forEach(uid => {
        const email = /(.*)?\.(.*)?@/.exec(beer.votes[`${uid}`].email.toString()) || [];
        if (email.length) {
          const fname = `${email[1].toUpperCase().charAt(0)}${email[1].toLowerCase().substring(1, email[1].length)}`;
          const lname = ` ${email[2].toUpperCase().charAt(0)}.`;
          this.voters[`${beer.id}`].push(fname + lname);
        }
        score = beer.votes[`${uid}`].vote ? score + 1 : score - 1;
      });
      this.counts[`${beer.id}`] = Object.keys(beer.votes).length || 0;
      this.scores[`${beer.id}`] = score;
    });
  }

  castVote(id: String, email: String, uid: String, vote: Boolean) {
    // const ballot: IVote = { created: new Date(), email, uid, vote };
    // this.activePollDoc
    //   .set({ ...this.activePoll, [`${id}`]: { [`${uid}`]: ballot }}, { merge: true })
    //   .catch(error => this.notify.error('Error casting vote', error));
  }

  undoVote(id: String, uid: String, vote: Boolean) {
    // this.activePollDoc
    //   .update({ [`${id}.${uid}`]: firebase.firestore.FieldValue.delete() })
    //   .catch(error => this.notify.error('Error undoing vote', error));
  }

  getVoteCount(uid: String) {
    // if (this.activePoll && Object.keys(this.activePoll).length) {
    //   let count = 0;
    //   Object.keys(this.activePoll).forEach(beerid => {
    //     Object.keys(this.activePoll[`${beerid}`]).forEach(id => count = id === uid ? count + 1 : count);
    //   });
    //   return count;
    // }
    return 0;
  }

  // TODO: Generate New Poll -> (+new Date).toString(36)

}
