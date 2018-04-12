import { Car } from "./car";
import { CarConfig } from "./carConfig";
import { Engine } from "./engine";
import { Vector3 } from "three";
import { TestBed, inject } from "@angular/core/testing";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { Physics } from "./physics";
import { CarStructure } from "./carStructure";
import { Personality } from "../artificial-intelligence/ai-config";

const MS_BETWEEN_FRAMES: number = 16.6667;

/* tslint:disable: no-magic-numbers */
class MockEngine extends Engine {
    public getDriveTorque(): number {
        return 10000;
    }
}

describe("Car", () => {
    let car: Car;

    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({
            providers: [KeyboardEventHandlerService]
        }).compileComponents()
            .then()
            .catch((e: Error) => console.error(e.message));

        car = new Car(undefined);
        await car.init(new Vector3(0, 0, 0), Math.PI);

        car.accelerate();
        car.update(MS_BETWEEN_FRAMES);
        car.releaseAccelerator();
        done();
    });

    it("should be instantiable using default constructor", inject(
        [KeyboardEventHandlerService], (keyBoardHandler: KeyboardEventHandlerService) => {
            car = new Car(keyBoardHandler, true, Personality.Curly, new CarStructure(new MockEngine));
            expect(car).toBeDefined();
            expect(car.speed.length()).toBe(0);
        }
    ));

    it("should accelerate when accelerator is pressed", () => {
        const initialSpeed: number = car.speed.length();
        car.accelerate();
        car.update(MS_BETWEEN_FRAMES);
        expect(car.speed.length()).toBeGreaterThan(initialSpeed);
    });

    it("should decelerate when brake is pressed", () => {
        // Remove rolling resistance and drag force so the only force slowing down the car is the brakes.
        const getRollingResistance: () => Vector3 = Physics["getRollingResistance"];
        const getDragForce: () => Vector3 = Physics["getDragForce"];
        Physics["getRollingResistance"] = () => {
            return new Vector3(0, 0, 0);
        };

        Physics["getDragForce"] = () => {
            return new Vector3(0, 0, 0);
        };

        car.accelerate();
        car.update(MS_BETWEEN_FRAMES);
        car.releaseAccelerator();

        const initialSpeed: number = car.speed.length();
        car.brake();
        car.update(MS_BETWEEN_FRAMES);

        Physics["getRollingResistance"] = getRollingResistance;
        Physics["getDragForce"] = getDragForce;

        expect(car.speed.length()).toBeLessThan(initialSpeed);
    });

    it("should decelerate without brakes", () => {
        const initialSpeed: number = car.speed.length();

        car.releaseBrakes();
        car.update(MS_BETWEEN_FRAMES);
        expect(car.speed.length()).toBeLessThan(initialSpeed);
    });

    it("should turn left when left turn key is pressed", () => {
        const initialAngle: number = car.angle;
        car.accelerate();
        car.steerLeft();
        car.update(MS_BETWEEN_FRAMES * 2);
        expect(car.angle).toBeLessThan(initialAngle);
    });

    it("should turn right when right turn key is pressed", () => {
        const initialAngle: number = car.angle;
        car.accelerate();
        car.steerRight();
        car.update(MS_BETWEEN_FRAMES * 2);
        expect(car.angle).toBeGreaterThan(initialAngle);
    });

    it("should not turn when steering keys are released", () => {
        car.accelerate();
        car.steerRight();
        car.update(MS_BETWEEN_FRAMES);

        const initialAngle: number = car.angle;
        car.releaseSteering();
        car.update(MS_BETWEEN_FRAMES);
        expect(car.angle).toBe(initialAngle);
    });

    it("should use default engine parameter when none is provided", inject(
        [KeyboardEventHandlerService], (keyBoardHandler: KeyboardEventHandlerService) => {
            car = new Car(keyBoardHandler, true);
            expect(car["_carStructure"].engine).toBeDefined();
        }));

    it("should use default Wheel parameter when none is provided", inject(
        [KeyboardEventHandlerService], (keyBoardHandler: KeyboardEventHandlerService) => {
            car = new Car(keyBoardHandler, true, Personality.Curly, new CarStructure(new MockEngine), undefined);
            expect(car["_carStructure"].rearWheel).toBeDefined();
        }
    ));

    it("should check validity of wheelbase parameter", inject(
        [KeyboardEventHandlerService], (keyBoardHandler: KeyboardEventHandlerService) => {
            car = new Car(keyBoardHandler, true, Personality.Curly, new CarStructure(new MockEngine));
            expect(car["_carStructure"].wheelbase).toBe(CarConfig.DEFAULT_WHEELBASE);
        }
    ));

    it("should check validity of mass parameter", inject(
        [KeyboardEventHandlerService], (keyBoardHandler: KeyboardEventHandlerService) => {
            car = new Car(keyBoardHandler, true, Personality.Curly, new CarStructure(new MockEngine));
            expect(car["_carStructure"].mass).toBe(CarConfig.DEFAULT_MASS);
        }
    ));

    it("should check validity of dragCoefficient parameter", inject(
        [KeyboardEventHandlerService], (keyBoardHandler: KeyboardEventHandlerService) => {
            car = new Car(keyBoardHandler, true, Personality.Curly, new CarStructure(new MockEngine));
            expect(car["_carStructure"].dragCoefficient).toBe(CarConfig.DEFAULT_DRAG_COEFFICIENT);
        }
    ));
});
