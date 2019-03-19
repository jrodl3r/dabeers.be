import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import * as Crypto from 'crypto-js';

import { SystemService } from './system.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  admins: Array<String> = [
    'U2FsdGVkX19LzHUmUgpYZEN/gAxBFhw+G7doMLlxjm1Ux0bnnxIjAodZFO+wZ44k',
    'U2FsdGVkX19s+bcPogElEiLnxOVpKrYppNoq+68ttZuXTB85N8CbP4WCIAhwiSOD',
    'U2FsdGVkX1+zkFHYnK9JVBBgjkVvnKGnBp0nnV3/FADMeDc7W2EW+WRLPB7LrRpwr6QRtIxVMLRlaavoJaX+SQ=='
  ];

  constructor(
    private system: SystemService,
    private notify: NotifyService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) { }

  canActivate(): Observable<boolean> | boolean {
    if (this.system.isBrowser()) {
      return this.afAuth.user.pipe(
        take(1),
        map(state => {
          const isAdmin = this.admins.find(admin => {
            const crypto = Crypto.AES.decrypt(admin, 'dabeers');
            const email = crypto.toString(Crypto.enc.Utf8).replace(/['"]+/g, '');
            return this.afAuth.auth.currentUser.email === email;
          });
          return this.afAuth.auth.currentUser !== null && !isAdmin ? false : !!state;
        }),
        tap(hasAccess => {
          if (!hasAccess) {
            this.notify.error('You must be an administrator');
            this.router.navigate(['/']);
          }
        })
      );
    }
    return true;
  }

}
