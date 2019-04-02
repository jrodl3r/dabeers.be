import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { shareReplay, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';

import { IPoll, IVote, IVoteList } from '../models/vote';

@Injectable({
  providedIn: 'root'
})
export class VoteService implements OnDestroy {
  private votesCollection: AngularFirestoreCollection<IVoteList>;
  votesSubscription: Subscription;
  polls: IPoll;
  voters: any = {};           // list of voters
  counts: any = {};           // total # of votes
  scores: any = {};           // votes tallied
  voteMax = 6;                // max # of user votes
  activeUserVotes = { count: 0 };   // active user's vote summary
  isLoading: Boolean = false;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private notify: NotifyService
  ) {
    this.isLoading = true;
    this.votesCollection = this.afs.collection<IVoteList>('votes');
    this.votesSubscription = this.votesCollection.valueChanges()
      .pipe(shareReplay(1))
      .subscribe(polls => {
        console.log(polls[0]);
        
        this.polls = polls;
        // Object.keys(polls).forEach(id => {
        //   this.polls[`${id}`] = polls[`${id}`];
        // });
        // this.calcTotals(polls);
        this.isLoading = false;
      },
      error => (() => {
        this.notify.error('Error fetching votes', error);
        this.isLoading = false;
      }));
  }

  ngOnDestroy() {
    this.votesSubscription.unsubscribe();
  }

  calcTotals(polls: IPoll[]) {
    Object.keys(polls).forEach(beer => {
      console.log(beer);
      
      let score = 0;
      this.voters[`${beer}`] = [];
      Object.keys(polls[`${beer}`]).forEach(uid => {
        const email = /(.*)?\.(.*)?@/.exec(polls[`${beer}`][`${uid}`].email.toString()) || [];
        if (email.length) {
          const fname = `${email[1].toUpperCase().charAt(0)}${email[1].toLowerCase().substring(1, email[1].length)}`;
          const lname = ` ${email[2].toUpperCase().charAt(0)}.`;
          this.voters[`${beer}`].push(fname + lname);
        }
        if (this.auth.getUserID() === uid) {
          this.activeUserVotes[`${beer}`] = polls[`${beer}`][`${uid}`].vote;
          this.activeUserVotes.count = this.activeUserVotes.count + 1;
        } else {
          delete this.activeUserVotes[`${beer}`];
        }
        score = polls[`${beer}`][`${uid}`].vote ? score + 1 : score - 1;
      });
      this.counts[`${beer}`] = Object.keys(polls[`${beer}`]).length || 0;
      this.scores[`${beer}`] = score;
    });
    console.log(this.polls, this.voters, this.counts);
  }

  castVote(id: String, email: String, uid: String, vote: Boolean) {
    const ballot: IVote = { created: new Date(), email, uid, vote };
    this.votesCollection.doc(`${id}`)
      .set({ votes: { [`${uid}`]: ballot }}, { merge: true })
      .catch(error => this.notify.error('Error casting vote', error));
  }

  undoVote(id: String, uid: String) {
    this.votesCollection.doc(`${id}`)
      .update({ [`votes.${uid}`]: firebase.firestore.FieldValue.delete() })
      // .then(() => {
        // this.activeUserVotes.count = this.activeUserVotes.count - 1;
        // delete this.activeUserVotes[`${id}`];
      // })
      .catch(error => this.notify.error('Error undoing vote', error));
  }

  // copyVotes() {
  //   let activePoll = {};
  //   const activePollDoc = this.afs.doc('polls/active');
  //   const activePollSub = activePollDoc.valueChanges()
  //     .pipe(take(1))
  //     .subscribe(votes => {
  //       activePoll = votes;
  //       Object.keys(activePoll).forEach(id => {
  //         this.votesCollection.doc(id).set(activePoll[`${id}`]);
  //       });
  //     },
  //     error => this.notify.error('Error fetching poll', error));
  // }

  // TODO: Generate New Poll -> (+new Date).toString(36)

}
