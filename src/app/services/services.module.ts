import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { SystemService } from './system.service';
import { NotifyService } from './notify.service';
import { AuthService } from './auth.service';
import { NavService } from './nav.service';
import { SeoService } from './seo.service';
import { VoteService } from './vote.service';
import { ProfileService } from './profile.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      extendedTimeOut: 500,
      newestOnTop: true,
      preventDuplicates: true,
      positionClass: 'toast-bottom-center'
    })
  ],
  providers: [
    SystemService,
    NotifyService,
    AuthService,
    NavService,
    SeoService,
    VoteService,
    ProfileService
  ]
})
export class ServicesModule { }
