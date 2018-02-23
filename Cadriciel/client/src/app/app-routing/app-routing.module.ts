import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RacingComponent } from "../racing/racing.component";
import { CrosswordComponent } from "../crossword/crossword.component";
import { AdminComponent } from "../racing/admin/admin.component";
import { EditorComponent } from "../racing/editor/editor.component";
import { ChooseTrackComponent } from "../racing/choose-track/choose-track.component";

const routes: Routes = [
    { path: "crossword", component: CrosswordComponent },
    { path: "admin", component: AdminComponent },
    { path: "admin/:id", component: EditorComponent },
    { path: "race", component: ChooseTrackComponent },
    { path: "race/:id", component: RacingComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
