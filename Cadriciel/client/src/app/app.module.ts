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
import { EditorComponent } from "./racing/editor/editor.component";
import { MouseEventHandlerService } from "./racing/event-handlers/mouse-event-handler.service";
import { ConfigurationComponent } from "./crossword/configuration/configuration.component";
import { AICarService } from "./racing/artificial-intelligence/ai-car.service";
import { KeyboardEventHandlerService } from "./racing/event-handlers/keyboard-event-handler.service";
import { ConfigurationService } from "./crossword/configuration/configuration.service";
import { ChooseTrackComponent } from "./racing/choose-track/choose-track.component";
import { RenderService } from "./racing/render-service/render.service";
import { SoundManagerService } from "./racing/sound-service/sound-manager.service";
import { MultiplayerCommunicationService } from "./crossword/multiplayer-communication.service";
import { CollisionManagerService } from "./racing/collision-manager/collision-manager.service";
import { CameraManagerService } from "./racing/cameras/camera-manager.service";
import { CarTrackingManagerService } from "./racing/carTracking-manager/car-tracking-manager.service";
import { BestTimesComponent } from "./racing/scoreboard/best-times/best-times.component";
import { InputTimeComponent } from "./racing/scoreboard/input-time/input-time.component";
import { HighscoreService } from "./racing/scoreboard/best-times/highscore.service";
import { EndGameTableComponent } from "./racing/scoreboard/end-game-table/end-game-table.component";
import { EndGameTableService } from "./racing/scoreboard/end-game-table/end-game-table.service";
import { InputTimeService } from "./racing/scoreboard/input-time/input-time.service";
import { TrackService } from "./racing/track/track-service/track.service";
import { GameTimeManagerService } from "./racing/game-time-manager/game-time-manager.service";
import { GameUpdateManagerService } from "./racing/game-update-manager/game-update-manager.service";
import { StateFactoryService } from "./racing/game-states/state-factory/state-factory.service";
import { CountdownComponent } from "./racing/countdown/countdown.component";
import { CountdownService } from "./racing/countdown/countdown.service";
import { ServiceLoaderService } from './racing/service-loader/service-loader.service';

@NgModule({
    declarations: [
        AppComponent,
        AdminComponent,
        RacingComponent,
        CrosswordComponent,
        EditorComponent,
        ChooseTrackComponent,
        ConfigurationComponent,
        BestTimesComponent,
        InputTimeComponent,
        EndGameTableComponent,
        CountdownComponent
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
        CollisionManagerService,
        CameraManagerService,
        CarTrackingManagerService,
        HighscoreService,
        EndGameTableService,
        InputTimeService,
        GameTimeManagerService,
        GameUpdateManagerService,
        StateFactoryService,
        CountdownService,
        ServiceLoaderService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
