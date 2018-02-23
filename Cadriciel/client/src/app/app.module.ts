import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { RenderService } from "./racing/render-service/render.service";
import { EditorRenderService } from "./racing/editor/editor-render-service/editor-render.service";
import { AppRoutingModule } from "./app-routing/app-routing.module";
import { CrosswordComponent } from "./crossword/crossword.component";
import { GridService } from "./crossword/grid.service";
import { AdminComponent } from "./racing/admin/admin.component";
import { RacingComponent } from "./racing/racing.component";
import { TrackService } from "./racing/track-service/track.service";
import { EditorComponent } from "./racing/editor/editor.component";
import { MouseEventHandlerService } from "./racing/event-handlers/mouse-event-handler.service";
import { CarAiService } from "./racing/artificial-intelligence/car-ai.service";
import { KeyboardEventHandlerService } from "./racing/event-handlers/keyboard-event-handler.service";
import { ConfigurationComponent } from "./crossword/configuration/configuration.component";
import { ConfigurationService } from "./crossword/configuration.service";

@NgModule({
    declarations: [
        AppComponent,
        AdminComponent,
        RacingComponent,
        CrosswordComponent,
        EditorComponent,
        ConfigurationComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
    ],
    providers: [
        RenderService,
        GridService,
        TrackService,
        EditorRenderService,
        MouseEventHandlerService,
        CarAiService,
        KeyboardEventHandlerService,
        ConfigurationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
