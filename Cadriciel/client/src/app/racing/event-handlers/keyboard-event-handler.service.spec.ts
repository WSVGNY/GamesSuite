/* tslint:disable: no-magic-numbers */
import { TestBed, inject } from "@angular/core/testing";

import { KeyboardEventHandlerService } from "./keyboard-event-handler.service";
import { Car } from "../car/car";
import { RaceGame } from "../game-loop/raceGame";
import { RenderService } from "../render-service/render.service";

const RACEGAME: RaceGame = new RaceGame(new RenderService());

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
        service.handleKeyDown(87, RACEGAME);
        expect(RACEGAME.playerCar["isAccelerating"]);

    });

});
