import { TestBed, inject } from "@angular/core/testing";
import { ServiceLoaderService } from "./service-loader.service";
import { AICarService } from "../artificial-intelligence/ai-car.service";
import { CameraManagerService } from "../cameras/camera-manager.service";
import { TrackService } from "../track/track-service/track.service";
import { InputTimeService } from "../scoreboard/input-time/input-time.service";
import { HighscoreService } from "../scoreboard/best-times/highscore.service";
import { EndGameTableService } from "../scoreboard/end-game-table/end-game-table.service";
import { SoundService } from "../sound-service/sound-manager.service";
import { CountdownService } from "../countdown/countdown.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { CarTrackingService } from "../tracking-service/tracking.service";
import { KeyboardEventService } from "../user-input-services/keyboard-event.service";
import { CarCollisionService } from "../collision-manager/carCollision.service";
import { WallCollisionService } from "../collision-manager/wallCollision.service";
import { TimeService } from "../time-service/time.service";

describe("ServiceLoaderService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
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
                InputTimeService,
                TrackService,
                KeyboardEventService,
                HttpClient,
                HttpHandler]
        });
    });

    it("should be created", inject([ServiceLoaderService], (service: ServiceLoaderService) => {
        expect(service).toBeTruthy();
    }));
});
