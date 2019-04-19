import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { NavModule } from '../_nav/nav.module';

import { AdminComponent } from './admin.component';
import { BeersComponent } from './beers/beers.component';
import { BeerItemComponent } from './beers/beer-item/beer-item.component';
import { UsersComponent } from './users/users.component';
import { PollsComponent } from './polls/polls.component';
import { SettingsComponent } from './settings/settings.component';

import { AdminService } from './admin.service';

import { SortUsersPipe } from '../../services/pipes/sort-users.pipe';

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
    PollsComponent,
    SettingsComponent,
    SortUsersPipe
  ],
  providers: [AdminService]
})
export class AdminModule { }
