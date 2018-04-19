import { TestBed, inject } from "@angular/core/testing";

import { StateFactoryService } from "./state-factory.service";
import { ServiceLoaderService } from "../../service-loader/service-loader.service";
import { HttpHandler, HttpClient } from "@angular/common/http";
import { TrackService } from "../../track/track-service/track.service";
import { EndGameTableService } from "../../scoreboard/end-game-table/end-game-table.service";
import { SoundService } from "../../sound-service/sound-manager.service";
import { CountdownService } from "../../countdown/countdown.service";
import { CameraManagerService } from "../../cameras/camera-manager.service";
import { AICarService } from "../../artificial-intelligence/ai-car.service";
import { CarTrackingService } from "../../tracking-service/tracking.service";
import { CarCollisionService } from "../../collision-manager/carCollision.service";
import { WallCollisionService } from "../../collision-manager/wallCollision.service";
import { KeyboardEventService } from "../../user-input-services/keyboard-event.service";
import { TimeService } from "../../time-service/time.service";
import { HighscoreService } from "../../scoreboard/highscores/highscore.service";
import { InputNameService } from "../../scoreboard/input-name/input-name.service";

describe("StateFactoryService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                StateFactoryService,
                ServiceLoaderService,
                AICarService,
                CarCollisionService,
                WallCollisionService,
                CameraManagerService,
                CarTrackingService,
                TimeService,
                CountdownService,
                SoundService,
                EndGameTableService,
                HighscoreService,
                InputNameService,
                TrackService,
                KeyboardEventService,
                HttpClient,
                HttpHandler]
        });
    });

    it("should be created", inject([StateFactoryService], (service: StateFactoryService) => {
        expect(service).toBeTruthy();
    }));
});
