import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { NavModule } from '../_nav/nav.module';

import { AdminComponent } from './admin.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    NavModule
  ],
  declarations: [AdminComponent]
})
export class AdminModule { }
