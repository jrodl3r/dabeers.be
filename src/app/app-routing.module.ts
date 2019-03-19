import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { AdminGuard } from './services/admin.guard';

import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  // {
  //   path: 'admin',
  //   loadChildren: './components/_admin/admin.module#AdminModule',
  //   canActivate: [AdminGuard]
  // },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
