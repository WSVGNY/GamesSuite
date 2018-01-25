import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RacingComponent } from "../racing/racing.component";
import { CrosswordComponent } from "../crossword/crossword.component";
import { AdminComponent } from "../racing/admin/admin.component";
import { EditorComponent } from "../racing/editor/editor.component";

const routes: Routes = [
  { path: "", redirectTo: "/course", pathMatch: "full" },
  { path: "mot-croise", component: CrosswordComponent },
  { path: "admin", component: AdminComponent },
  { path: "admin/:id", component: EditorComponent },
  { path: "course", component: RacingComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
