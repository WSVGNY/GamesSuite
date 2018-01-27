import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";

import { RenderService } from "./racing/render-service/render.service";
import { BasicService } from "./basic.service";
import { EditorRenderService } from "./racing/editor-render-service/editor-render.service";
import { AppRoutingModule } from "./app-routing/app-routing.module";
import { CrosswordComponent } from "./crossword/crossword.component";
import { GridService } from "./crossword/grid.service";
import { AdminComponent } from "./racing/admin/admin.component";
import { RacingComponent } from "./racing/racing.component";
import { TrackService } from "./racing/track-service/track.service";
import { EditorComponent } from "./racing/editor/editor.component";
@NgModule({
    declarations: [
        AppComponent,
        AdminComponent,
        RacingComponent,
        CrosswordComponent,
        EditorComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
    ],
    providers: [
        RenderService,
        BasicService,
        GridService,
        TrackService,
        EditorRenderService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
