import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';

import { IPoll, IVoteList, IVote } from '../models/vote';

@Injectable({
  providedIn: 'root'
})
export class VoteService implements OnDestroy {
  votesCollection: AngularFirestoreCollection<IVoteList>;
  votesSub: Subscription;
  polls: IPoll = {};
  voters: any = {};     // list of user names
  counts: any = {};     // total # of votes
  scores: any = {};     // votes tallied
  userVoteMax = 6;
  userVoteCount = 0;
  isLoading: Boolean = false;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private notify: NotifyService
  ) {
    this.isLoading = true;
    this.votesCollection = this.afs.collection<IVoteList>('votes');
    this.votesSub = this.votesCollection.snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const votes = a.payload.doc.data() as IVoteList;
          const id = a.payload.doc.id;
          return { id, votes };
        }))
      )
      .subscribe(beers => {
        beers.forEach(beer => this.polls[`${beer.id}`] = beer.votes);
        this.calcTotals();
        this.isLoading = false;
      },
      error => (() => {
        this.notify.error('Error fetching votes', error);
        this.isLoading = false;
      }));
  }

  ngOnDestroy() {
    this.votesSub.unsubscribe();
  }

  calcTotals() {
    this.userVoteCount = 0;
    Object.keys(this.polls).forEach(beer => {
      let score = 0;
      this.voters[`${beer}`] = [];
      Object.keys(this.polls[`${beer}`]).forEach(uid => {
        const email = /(.*)?\.(.*)?@/.exec(this.polls[`${beer}`][`${uid}`].email.toString()) || [];
        if (email.length) {
          const fname = `${email[1].toUpperCase().charAt(0)}${email[1].toLowerCase().substring(1, email[1].length)}`;
          const lname = ` ${email[2].toUpperCase().charAt(0)}.`;
          this.voters[`${beer}`].push(fname + lname);
        }
        this.userVoteCount = this.auth.getUserID() === uid ? this.userVoteCount + 1 : this.userVoteCount;
        score = this.polls[`${beer}`][`${uid}`].vote ? score + 1 : score - 1;
      });
      this.counts[`${beer}`] = Object.keys(this.polls[`${beer}`]).length || 0;
      this.scores[`${beer}`] = score;
    });
  }

  castVote(id: String, vote: Boolean) {
    const email = this.auth.getUserEmail();
    const uid = this.auth.getUserID();
    const ballot: IVote = { created: new Date(), email, uid, vote };
    this.votesCollection.doc(`${id}`)
      .set({ [`${uid}`]: ballot }, { merge: true })
      .catch(error => this.notify.error('Error casting vote', error));
  }

  undoVote(id: String) {
    const uid = this.auth.getUserID();
    this.votesCollection.doc(`${id}`)
      .update({ [`${uid}`]: firebase.firestore.FieldValue.delete() })
      .catch(error => this.notify.error('Error undoing vote', error));
  }

}
