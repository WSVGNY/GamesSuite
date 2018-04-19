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
import { ConfigurationComponent } from "./crossword/configuration/configuration.component";
import { AICarService } from "./racing/artificial-intelligence/ai-car.service";
import { ConfigurationService } from "./crossword/configuration/configuration.service";
import { ChooseTrackComponent } from "./racing/choose-track/choose-track.component";
import { RenderService } from "./racing/render-service/render.service";
import { SoundManagerService } from "./racing/sound-service/sound-manager.service";
import { MultiplayerCommunicationService } from "./crossword/multiplayer-communication.service";
import { CameraManagerService } from "./racing/cameras/camera-manager.service";
import { EndGameTableComponent } from "./racing/scoreboard/end-game-table/end-game-table.component";
import { EndGameTableService } from "./racing/scoreboard/end-game-table/end-game-table.service";
import { TrackService } from "./racing/track/track-service/track.service";
import { StateFactoryService } from "./racing/game-states/state-factory/state-factory.service";
import { CountdownComponent } from "./racing/countdown/countdown.component";
import { CountdownService } from "./racing/countdown/countdown.service";
import { ServiceLoaderService } from "./racing/service-loader/service-loader.service";
import { CarCollisionService } from "./racing/collision-manager/carCollision.service";
import { WallCollisionService } from "./racing/collision-manager/wallCollision.service";
import { CarTrackingService } from "./racing/tracking-service/tracking.service";
import { MouseEventService } from "./racing/user-input-services/mouse-event.service";
import { KeyboardEventService } from "./racing/user-input-services/keyboard-event.service";
import { TimeService } from "./racing/time-service/time.service";
import { HighscoreComponent } from "./racing/scoreboard/highscores/highscore.component";
import { HighscoreService } from "./racing/scoreboard/highscores/highscore.service";
import { InputNameComponent } from "./racing/scoreboard/input-name/input-name.component";
import { InputNameService } from "./racing/scoreboard/input-name/input-name.service";

@NgModule({
    declarations: [
        AppComponent,
        AdminComponent,
        RacingComponent,
        CrosswordComponent,
        EditorComponent,
        ChooseTrackComponent,
        ConfigurationComponent,
        HighscoreComponent,
        InputNameComponent,
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
        MouseEventService,
        AICarService,
        KeyboardEventService,
        RenderService,
        SoundManagerService,
        MultiplayerCommunicationService,
        CameraManagerService,
        CarTrackingService,
        HighscoreService,
        EndGameTableService,
        InputNameService,
        TimeService,
        StateFactoryService,
        CountdownService,
        ServiceLoaderService,
        CarCollisionService,
        WallCollisionService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
