import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { NavModule } from '../_nav/nav.module';

import { AdminComponent } from './admin.component';
import { BeersComponent } from './beers/beers.component';
import { UsersComponent } from './users/users.component';
import { HistoryComponent } from './history/history.component';

import { SortUserHistoryPipe } from '../../services/pipes/sort-user-history.pipe';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NavModule
  ],
  declarations: [
    AdminComponent,
    BeersComponent,
    UsersComponent,
    HistoryComponent,
    SortUserHistoryPipe
  ]
})
export class AdminModule { }
