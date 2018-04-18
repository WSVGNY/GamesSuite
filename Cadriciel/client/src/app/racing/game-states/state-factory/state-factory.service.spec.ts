import { TestBed, inject } from "@angular/core/testing";

import { StateFactoryService } from "./state-factory.service";
import { ServiceLoaderService } from "../../service-loader/service-loader.service";
import { HttpHandler, HttpClient } from "@angular/common/http";
import { KeyboardEventHandlerService } from "../../event-handlers/keyboard-event-handler.service";
import { TrackService } from "../../track/track-service/track.service";
import { InputTimeService } from "../../scoreboard/input-time/input-time.service";
import { HighscoreService } from "../../scoreboard/best-times/highscore.service";
import { EndGameTableService } from "../../scoreboard/end-game-table/end-game-table.service";
import { SoundManagerService } from "../../sound-service/sound-manager.service";
import { CountdownService } from "../../countdown/countdown.service";
import { GameTimeManagerService } from "../../game-time-manager/game-time-manager.service";
import { CarTrackingService } from "../../carTracking-manager/car-tracking-manager.service";
import { CameraManagerService } from "../../cameras/camera-manager.service";
import { CollisionManagerService } from "../../collision-manager/collision-manager.service";
import { AICarService } from "../../artificial-intelligence/ai-car.service";

describe("StateFactoryService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                StateFactoryService,
                ServiceLoaderService,
                AICarService,
                CollisionManagerService,
                CameraManagerService,
                CarTrackingService,
                GameTimeManagerService,
                CountdownService,
                SoundManagerService,
                EndGameTableService,
                HighscoreService,
                InputTimeService,
                TrackService,
                KeyboardEventHandlerService,
                HttpClient,
                HttpHandler]
        });
    });

    it("should be created", inject([StateFactoryService], (service: StateFactoryService) => {
        expect(service).toBeTruthy();
    }));
});
