import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

import { NotifyService } from '../../services/notify.service';

import { IUser } from '../../models/user';

@Injectable()
export class AdminService implements OnDestroy {
  usersCollection: AngularFirestoreCollection<IUser>;
  usersSub: Subscription;
  users: Array<IUser>;
  isLoading: Boolean = false;

  constructor(
    private afs: AngularFirestore,
    private notify: NotifyService
  ) {
    this.isLoading = true;
    this.usersCollection = this.afs.collection<IUser>('users');
    this.usersSub = this.usersCollection.valueChanges()
      .subscribe(users => {
        if (users.length > 1) {
          this.users = users;
          this.isLoading = false;
        }
      },
      error => (() => {
        this.notify.error('Error fetching users', error);
        this.isLoading = false;
      }));
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }

}
