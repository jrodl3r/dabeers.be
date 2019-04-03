import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { NavModule } from '../_nav/nav.module';

import { AdminComponent } from './admin.component';
import { BeersComponent } from './beers/beers.component';
import { BeerItemComponent } from './beers/beer-item/beer-item.component';
import { UsersComponent } from './users/users.component';
import { HistoryComponent } from './history/history.component';

import { AdminService } from './admin.service';
import { SortUserPipe } from '../../services/pipes/sort-user.pipe';

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
    BeerItemComponent,
    UsersComponent,
    HistoryComponent,
    SortUserPipe
  ],
  providers: [AdminService]
})
export class AdminModule { }
