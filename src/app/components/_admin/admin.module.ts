import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { NavModule } from '../_nav/nav.module';

import { AdminComponent } from './admin.component';
import { BeersComponent } from './beers/beers.component';
import { UsersComponent } from './users/users.component';
import { HistoryComponent } from './history/history.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    NavModule
  ],
  declarations: [
    AdminComponent,
    BeersComponent,
    UsersComponent,
    HistoryComponent
  ]
})
export class AdminModule { }
