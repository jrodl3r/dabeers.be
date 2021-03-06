import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServicesModule } from './services/services.module';
import { NavModule } from './components/_nav/nav.module';

import { ActiveItemsPipe } from './services/pipes/active-items.pipe';
import { SortItemsPipe } from './services/pipes/sort-items.pipe';

import { HomeComponent } from './components/home/home.component';
import { VoteComponent } from './components/vote/vote.component';
import { VoteItemComponent } from './components/vote/vote-item/vote-item.component';
import { ErrorComponent } from './components/error/error.component';
import { LoadingComponent } from './components/loading/loading.component';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VoteComponent,
    VoteItemComponent,
    ErrorComponent,
    LoadingComponent,
    ActiveItemsPipe,
    SortItemsPipe
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-fire-universal' }),
    AppRoutingModule,
    ServicesModule,
    NavModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
