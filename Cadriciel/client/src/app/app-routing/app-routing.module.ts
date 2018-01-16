import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent } from '../game-component/game.component';
import { MotCroiseComponent } from '../mot-croise/mot-croise.component';
import { AdminComponent } from '../admin/admin.component';

const routes: Routes = [
  { path: '', redirectTo: '/course', pathMatch: 'full' },
  { path: 'course', component: GameComponent },
  { path: 'mot-croise', component: MotCroiseComponent },
  { path: 'admin', component: AdminComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
