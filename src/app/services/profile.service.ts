import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { shareReplay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { NotifyService } from './notify.service';

import { IUserProfiles, IUserProfile } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService implements OnDestroy {
  userProfiles: IUserProfiles;
  userProfilesSub: Subscription;
  userProfilesDoc: AngularFirestoreDocument;
  userIndex: Array<string>;
  isLoading: Boolean = false;

  constructor(
    private afs: AngularFirestore,
    private notify: NotifyService
  ) { }

  ngOnDestroy() {
    if (this.userProfilesSub) {
      this.userProfilesSub.unsubscribe();
    }
  }

  getUsers() {
    this.isLoading = true;
    this.userProfilesDoc = this.afs.doc<IUserProfiles>('profiles/users');
    this.userProfilesSub = this.userProfilesDoc.valueChanges()
      .pipe(shareReplay(1))
      .subscribe(userProfiles => {
        this.userProfiles = userProfiles;
        this.userIndex = Object.keys(this.userProfiles);
        this.isLoading = false;
      },
      error => this.notify.error('Error fetching user history', error));
  }

  addUser(uid: String, email: String, date: Date) {
    const user: IUserProfile = { uid, email, lastLogin: date };
    console.log('addUser()', { [`${uid}`]: user });

    this.userProfilesDoc = this.afs.doc<IUserProfiles>('profiles/users');
    this.userProfilesDoc
      .set({ [`${uid}`]: user }, { merge: true })
      .catch(error => this.notify.error('Error saving user profile', error));
  }

  updateUser(uid: String, date: Date) {
    console.log('updateUser()', { [`${uid}`]: { uid, lastLogin: date }});

    this.userProfilesDoc = this.afs.doc<IUserProfiles>('profiles/users');
    this.userProfilesDoc
      .set({ [`${uid}`]: { lastLogin: date }}, { merge: true })
      .catch(error => this.notify.error('Error updating user profile', error));
  }

}
