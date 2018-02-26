/* tslint:disable: no-magic-numbers */
import { TestBed, inject } from "@angular/core/testing";

import { KeyboardEventHandlerService } from "./keyboard-event-handler.service";
import { Car } from "../car/car";
import { RaceGame } from "../game-loop/raceGame";
import { RenderService } from "../render-service/render.service";

const RACEGAME: RaceGame = new RaceGame(new RenderService());
const MS_BETWEEN_FRAMES: number = 16.6667;
const MAXIMUM_STEERING_ANGLE: number = 0.15;

describe("KeyboardEventHandlerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [KeyboardEventHandlerService]
        });
    });

    it("should be created", inject([KeyboardEventHandlerService], (service: KeyboardEventHandlerService) => {
        expect(service).toBeTruthy();
    }));

    it("should accelerate on key press", inject([KeyboardEventHandlerService], (service: KeyboardEventHandlerService) => {
        service.handleKeyDown(new KeyboardEvent("87"), RACEGAME);
        expect(RACEGAME.playerCar["_isAcceleratorPressed"]);
    }));

    it("should break on key press", inject([KeyboardEventHandlerService], (service: KeyboardEventHandlerService) => {
        service.handleKeyDown(new KeyboardEvent("83"), RACEGAME);
        expect(RACEGAME.playerCar["_isBraking"]);
    }));

    it("should turn on key press", inject([KeyboardEventHandlerService], (service: KeyboardEventHandlerService) => {
        service.handleKeyDown(new KeyboardEvent("65"), RACEGAME);
        RACEGAME.playerCar.update(MS_BETWEEN_FRAMES);
        expect(RACEGAME.playerCar["_steeringWheelDirection"]).toBeGreaterThan(0);

    }));

    it("the speed should increase on key hold", inject([KeyboardEventHandlerService], (service: KeyboardEventHandlerService) => {
        const initialSpeed: number = RACEGAME.playerCar.speed.length();
        service.handleKeyDown(new KeyboardEvent("87"), RACEGAME);
        RACEGAME.playerCar.update(MS_BETWEEN_FRAMES);
        expect(RACEGAME.playerCar.speed.length()).toBeGreaterThan(initialSpeed);
    }));

});
