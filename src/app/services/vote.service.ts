import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';

import { IPoll, IVote } from '../models/vote';

@Injectable({
  providedIn: 'root'
})
export class VoteService implements OnDestroy {
  votesDoc: AngularFirestoreDocument<IPoll>;
  votesSub: Subscription;
  votes: IPoll = {};
  voters: any = {};     // list of user names
  counts: any = {};     // total # of votes
  scores: any = {};     // votes tallied
  userVoteMax = 6;
  userVoteCount = 0;
  sortFlag = 'score';
  pipeWiggle: Boolean = true;
  isLoading: Boolean = false;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private notify: NotifyService
  ) {
    this.isLoading = true;
    this.votesDoc = this.afs.doc('items/votes');
    this.votesSub = this.votesDoc.valueChanges()
      .subscribe(votes => {
        this.votes = votes;
        this.calcTotals();
        this.isLoading = false;
      },
      error => {
        this.notify.error('Error fetching votes', error);
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.votesSub.unsubscribe();
  }

  private updateVotes(votes: IPoll) {
    return this.votesDoc.set(votes)
      .catch(error => this.notify.error('Error updating votes', error));
  }

  calcTotals() {
    this.userVoteCount = 0;
    Object.keys(this.votes).forEach(beer => {
      let score = 0;
      this.voters[`${beer}`] = [];
      Object.keys(this.votes[`${beer}`]).forEach(uid => {
        const email = /(.*)?\.(.*)?@/.exec(this.votes[`${beer}`][`${uid}`].email.toString()) || [];
        if (email.length) {
          const fname = `${email[1].toUpperCase().charAt(0)}${email[1].toLowerCase().substring(1, email[1].length)}`;
          const lname = ` ${email[2].toUpperCase().charAt(0)}.`;
          const name = fname + lname;
          this.voters[`${beer}`].push({ name, uid, vote: this.votes[`${beer}`][`${uid}`].vote });
        }
        this.userVoteCount = this.auth.getUserID() === uid ? this.userVoteCount + 1 : this.userVoteCount;
        score = this.votes[`${beer}`][`${uid}`].vote ? score + 1 : score - 1;
      });
      this.counts[`${beer}`] = Object.keys(this.votes[`${beer}`]).length || 0;
      this.scores[`${beer}`] = score;
    });
    // this.pipeWiggle = !this.pipeWiggle;
  }

  castVote(id: String, vote: Boolean) {
    const email = this.auth.getUserEmail();
    const uid = this.auth.getUserID();
    const ballot: IVote = { created: new Date(), email, uid, vote };
    this.votesDoc.ref.get()
      .then(response => {
        const votes: IPoll = response.data();
        votes[`${id}`][`${uid}`] = ballot;
        return this.updateVotes(votes)
          .then(() => {
            this.auth.saveActivity();
            this.notify.success('Vote cast!');
          });
      })
      .catch(error => this.notify.error('Error casting vote', error));
  }

  undoVote(id: String) {
    const uid = this.auth.getUserID();
    this.votesDoc.ref.get()
      .then(response => {
        const votes: IPoll = response.data();
        delete votes[`${id}`][`${uid}`];
        return this.updateVotes(votes)
          .then(() => {
            this.auth.saveActivity();
            this.notify.warn('Vote Undone');
          });
      })
      .catch(error => this.notify.error('Error undoing vote', error));
  }

  setSortFlag(event: Event, flag: String) {
    event.preventDefault();
    this.sortFlag = flag.toString();
  }

  getUserVotes(uid: String) {
    const votes = [];
    Object.keys(this.voters).forEach(beer => {
      this.voters[beer].forEach(user => {
        if (user.uid === uid) {
          votes.push({ beer, vote: user.vote });
        }
      });
    });
    return votes;
  }

}
