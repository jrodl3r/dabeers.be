import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { AuthGuard } from './services/auth.guard';

import { HomeComponent } from './components/home/home.component';
// import { VoteComponent } from './components/vote/vote/vote.component';
// import { ResultsComponent } from './components/results/results/results.component';

import { ErrorComponent } from './components/error/error.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: 'vote', component: VoteComponent, canActivate: [AuthGuard] },
  // { path: 'results', component: ResultsComponent, canActivate: [AuthGuard] },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
