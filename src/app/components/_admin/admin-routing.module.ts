import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { BeersComponent } from './beers/beers.component';
import { UsersComponent } from './users/users.component';
import { PollsComponent } from './polls/polls.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/admin/beers' },
      { path: 'beers', component: BeersComponent },
      { path: 'users', component: UsersComponent },
      { path: 'polls', component: PollsComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
