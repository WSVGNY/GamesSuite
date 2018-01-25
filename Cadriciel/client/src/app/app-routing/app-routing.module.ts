import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { JeuCourseComponent } from "../jeu-course/jeu-course.component";
import { MotCroiseComponent } from "../mot-croise/mot-croise.component";
import { AdminComponent } from "../jeu-course/admin/admin.component";
import { EditorComponent } from "../jeu-course/editor/editor.component";

const routes: Routes = [
  { path: "", redirectTo: "/course", pathMatch: "full" },
  { path: "mot-croise", component: MotCroiseComponent },
  { path: "admin", component: AdminComponent },
  { path: "admin/:id", component: EditorComponent },
  { path: "course", component: JeuCourseComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
