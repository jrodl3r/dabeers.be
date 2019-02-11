import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { BeersComponent } from './beers/beers.component';
import { UsersComponent } from './users/users.component';
import { HistoryComponent } from './history/history.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/admin/beers' },
      { path: 'beers', component: BeersComponent },
      { path: 'users', component: UsersComponent },
      { path: 'history', component: HistoryComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
