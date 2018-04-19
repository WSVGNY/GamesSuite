import { TestBed, inject } from "@angular/core/testing";
import { ServiceLoaderService } from "./service-loader.service";
import { AICarService } from "../artificial-intelligence/ai-car.service";
import { CameraManagerService } from "../cameras/camera-manager.service";
import { TrackService } from "../track/track-service/track.service";
import { EndGameTableService } from "../scoreboard/end-game-table/end-game-table.service";
import { CountdownService } from "../countdown/countdown.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { CarTrackingService } from "../tracking-service/tracking.service";
import { KeyboardEventService } from "../user-input-services/keyboard-event.service";
import { CarCollisionService } from "../collision-manager/carCollision.service";
import { WallCollisionService } from "../collision-manager/wallCollision.service";
import { TimeService } from "../time-service/time.service";
import { HighscoreService } from "../scoreboard/highscores/highscore.service";
import { InputNameService } from "../scoreboard/input-name/input-name.service";
import { SoundService } from "../sound-service/sound.service";

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
                InputNameService,
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
