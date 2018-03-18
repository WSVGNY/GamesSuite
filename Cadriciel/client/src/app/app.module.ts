import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing/app-routing.module";
import { CrosswordComponent } from "./crossword/crossword.component";
import { GridService } from "./crossword/grid.service";
import { AdminComponent } from "./racing/admin/admin.component";
import { RacingComponent } from "./racing/race-game/racing.component";
import { TrackService } from "./racing/track-service/track.service";
import { EditorComponent } from "./racing/editor/editor.component";
import { MouseEventHandlerService } from "./racing/event-handlers/mouse-event-handler.service";
import { ConfigurationComponent } from "./crossword/configuration/configuration.component";
import { AICarService } from "./racing/artificial-intelligence/ai-car.service";
import { KeyboardEventHandlerService } from "./racing/event-handlers/keyboard-event-handler.service";
import { ConfigurationService } from "./crossword/configuration.service";
import { ChooseTrackComponent } from "./racing/choose-track/choose-track.component";
import { RenderService } from "./racing/render-service/render.service";
import { SoundManagerService } from "./racing/sound-service/sound-manager.service";
import { MultiplayerCommunicationService } from "./crossword/multiplayer-communication.service";
import { CollisionManagerService } from "./racing/collision-manager/collision-manager.service";

@NgModule({
    declarations: [
        AppComponent,
        AdminComponent,
        RacingComponent,
        CrosswordComponent,
        EditorComponent,
        ChooseTrackComponent,
        ConfigurationComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule
    ],
    providers: [
        GridService,
        TrackService,
        ConfigurationService,
        MouseEventHandlerService,
        AICarService,
        KeyboardEventHandlerService,
        RenderService,
        SoundManagerService,
        MultiplayerCommunicationService,
        CollisionManagerService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
