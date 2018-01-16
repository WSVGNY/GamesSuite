import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JeuCourseComponent } from '../jeu-course/jeu-course.component';
import { MotCroiseComponent } from '../mot-croise/mot-croise.component';

const routes: Routes = [
  { path: '', redirectTo: '/course', pathMatch: 'full' },
  { path: 'course', component: JeuCourseComponent },
  { path: 'mot-croise', component: MotCroiseComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
