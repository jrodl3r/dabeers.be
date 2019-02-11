import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { SystemService } from './system.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  admins: Array<String> = [
    'john.rodler@lightspeedvt.com',
    'eric.mullen@lightspeedvt.com'
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
          if (this.afAuth.auth.currentUser !== null && !(this.admins.indexOf(this.afAuth.auth.currentUser.email) >= 0)) {
            return false;
          }
          return !!state;
        }),
        tap(hasAccess => {
          if (!hasAccess) {
            this.notify.error('You must be an administrator');
            this.router.navigate(['/']);
          }
        })
      );
    }
    return true; // FIXME: This is a temp hack to avoid auth flicker (https://goo.gl/GYGz3J)
  }

}
