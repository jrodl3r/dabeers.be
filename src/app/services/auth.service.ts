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

  // Save new user
  private createUser(user: IUser) {
    const userRef: AngularFirestoreDocument<IUser> = this.afs.doc<IUser>(`users/${user.uid}`);
    return userRef.ref.get()
      .then(userDoc => {
        if (!userDoc.exists) {
          const data: IUser = {
            created: new Date(),
            lastLogin: new Date(),
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            email: user.email,
            isActive: true,
            profile: {},
            uid: user.uid
          };
          return userRef.set(data);
        }
        return userRef.update({
          lastLogin: new Date(),
          photoURL: user.photoURL || ''
        });
      });
  }

  // OAuth login
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

  // Redirect OAuth login
  public redirectAfterSignIn() {
    if (this.system.isBrowser() && sessionStorage.getItem('login-pending')) {
      this.isLoading = true;
      sessionStorage.removeItem('login-pending');
      this.afAuth.auth.getRedirectResult()
        .then(response => {
          // Must have LightspeedVT email address
          if (response.user && response.user.email.indexOf('@lightspeedvt.com') !== -1) {
            this.createUser(response.user);
            this.zone.run(async () => await this.router.navigate(['/']))
              .then(() => setTimeout(() => this.isLoading = false, 100));
          } else {
            this.logout();
            this.notify.error('LightSpeedVT Personel Only - Fuck Off!');
          }
        })
        .catch(error => {
          this.isLoading = false;
          this.notify.error(error);
        });
    }
  }

  // Google login
  public googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    this.oAuthLogin(provider);
  }

  public logout() {
    this.afAuth.auth.signOut().then(() => {
      if (this.system.isBrowser) {
        sessionStorage.clear();
      }
      this.zone.run(async () => await this.router.navigate(['/']));
    });
  }

  public isLoggedIn(): Boolean {
    if (this.system.isBrowser()) {
      return !!sessionStorage.getItem('user') && sessionStorage.getItem('user') !== 'null';
    }
    return this.afAuth.auth.currentUser !== null;
  }

  public getUserID(): String {
    if (this.isLoggedIn()) {
      return this.afAuth.auth.currentUser.uid;
    }
    return '';
  }

}
