import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { Observable, of } from 'rxjs';
import { switchMap, shareReplay, startWith, tap } from 'rxjs/operators';

import { SystemService } from './system.service';
import { NotifyService } from './notify.service';

import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userDoc: AngularFirestoreDocument<IUser>;
  user: Observable<IUser | null>;
  isLoading: Boolean = false;

  constructor(
    private system: SystemService,
    private notify: NotifyService,
    private router: Router,
    private zone: NgZone,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.user = system.isBrowser() ? afAuth.authState.pipe(
      switchMap(user => user ? this.afs.doc<IUser>(`users/${user.uid}`).valueChanges() : of(null)),
      tap(user => sessionStorage.setItem('user', JSON.stringify(user))),
      shareReplay(1), // Cache user
      startWith(() => {
        const user = sessionStorage.getItem('user');
        return user !== 'undefined' ? JSON.parse(user) : null;
      })
    ) : afAuth.authState;
  }

  public googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    this.oAuthLogin(provider);
  }

  private oAuthLogin(provider: any) {
    if (this.system.isBrowser()) {
      sessionStorage.setItem('login-pending', '1');
      this.afAuth.auth
        .signInWithRedirect(provider)
        .catch(error => {
          sessionStorage.removeItem('login-pending');
          this.isLoading = false;
          this.notify.error(error);
        });
    }
  }

  public redirectAfterSignIn() {
    if (this.system.isBrowser() && sessionStorage.getItem('login-pending')) {
      this.isLoading = true;
      sessionStorage.removeItem('login-pending');
      this.afAuth.auth.getRedirectResult()
        .then(response => {
          if (response.user) {
            if (response.user.email.indexOf('@lightspeedvt.com') !== -1) { // LightspeedVT email required
              this.saveUser(response.user);
              this.zone.run(async () => await this.router.navigate(['/']))
                .then(() => setTimeout(() => this.isLoading = false, 100));
            } else {
              this.notify.error('LightSpeedVT.com email required');
              this.logout();
            }
          } else { this.notify.error('Error fetching user account'); }
        })
        .catch(error => {
          this.isLoading = false;
          this.notify.error(error);
        });
    }
  }

  private saveUser(user: IUser) {
    const date = new Date();
    this.userDoc = this.afs.doc<IUser>(`users/${user.uid}`);
    this.userDoc.ref.get()
      .then(userRef => {
        if (!userRef.exists) {
          const data: IUser = {
            created: date,
            lastActive: date,
            lastLogin: date,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            email: user.email,
            isActive: true,
            uid: user.uid
          };
          return this.userDoc.set(data);
        }
        this.userDoc.update({
          lastActive: date,
          lastLogin: date,
          photoURL: user.photoURL || ''
        });
      })
      .catch(error => this.notify.error('Error saving user account', error));
  }

  public saveActivity() {
    this.userDoc = this.afs.doc<IUser>(`users/${this.getUserID()}`);
    this.userDoc.ref.get()
      .then(user => {
        if (user.exists) {
          this.userDoc.update({ lastActive: new Date() });
        }
      })
      .catch(error => this.notify.error('Error saving user activity', error));
  }

  public logout() {
    this.afAuth.auth.signOut()
      .then(() => {
        if (this.system.isBrowser) {
          sessionStorage.clear();
        }
        this.zone.run(async () => await this.router.navigate(['/']));
      })
      .catch(error => this.notify.error('Error logging out', error));
  }

  public isLoggedIn(): Boolean {
    return this.afAuth.auth.currentUser !== null;
  }

  public getUserID(): String {
    return this.isLoggedIn() ? this.afAuth.auth.currentUser.uid : '';
  }

  public getUserEmail(): String {
    return this.isLoggedIn() ? this.afAuth.auth.currentUser.email : '';
  }

}
