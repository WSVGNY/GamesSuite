/* tslint:disable: no-magic-numbers */
import { TestBed, inject } from "@angular/core/testing";

import { KeyboardEventHandlerService } from "./keyboard-event-handler.service";
import { RaceGame } from "../game-loop/raceGame";
import { RenderService } from "../render-service/render.service";
import { Car } from "../car/car";
import { Vector3 } from "three";

const MS_BETWEEN_FRAMES: number = 16.6667;

describe("KeyboardEventHandlerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [KeyboardEventHandlerService, RenderService]
        });
    });

    it("should be created", inject([KeyboardEventHandlerService], (keyboardService: KeyboardEventHandlerService) => {
        expect(keyboardService).toBeTruthy();
    }));

    it("should be created", inject([RenderService], (renderService: RenderService) => {
        expect(renderService).toBeTruthy();
    }));

    it(
        "should accelerate on key press",
        inject(
            [KeyboardEventHandlerService, RenderService],
            (service: KeyboardEventHandlerService, renderService: RenderService) => {
                const raceGame: RaceGame = new RaceGame(renderService);
                service.handleKeyDown(new KeyboardEvent("87"), raceGame);
                expect(raceGame.playerCar["_isAcceleratorPressed"]);
            }
        )
    );

    it(
        "should break on key press",
        inject(
            [KeyboardEventHandlerService, RenderService],
            (service: KeyboardEventHandlerService, renderService: RenderService) => {
                const raceGame: RaceGame = new RaceGame(renderService);
                service.handleKeyDown(new KeyboardEvent("83"), raceGame);
                expect(raceGame.playerCar["_isBraking"]);
            }
        )
    );

    it(
        "should turn on key press",
        inject(
            [KeyboardEventHandlerService, RenderService],
            (service: KeyboardEventHandlerService, renderService: RenderService) => {
                const raceGame: RaceGame = new RaceGame(renderService);
                service.handleKeyDown(new KeyboardEvent("65"), raceGame);
                const car: Car = new Car();
                car.init(new Vector3(0, 0, 0), 0).then(() => {
                    raceGame["_playerCar"] = car;
                    raceGame.playerCar.update(MS_BETWEEN_FRAMES);
                    expect(raceGame.playerCar["_steeringWheelDirection"]).toBeGreaterThan(0);
                });
            }
        )
    );

    it(
        "the speed should increase on key hold",
        inject(
            [KeyboardEventHandlerService, RenderService],
            (service: KeyboardEventHandlerService, renderService: RenderService) => {
                const raceGame: RaceGame = new RaceGame(renderService);
                const initialSpeed: number = raceGame.playerCar.speed.length();
                service.handleKeyDown(new KeyboardEvent("87"), raceGame);
                const car: Car = new Car();
                car.init(new Vector3(0, 0, 0), 0).then(() => {
                    raceGame["_playerCar"] = car;
                    raceGame.playerCar.update(MS_BETWEEN_FRAMES);
                    expect(raceGame.playerCar.speed.length()).toBeGreaterThan(initialSpeed);
                });
            }
        )
    );

});
