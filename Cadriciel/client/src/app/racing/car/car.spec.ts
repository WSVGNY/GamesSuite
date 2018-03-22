import { Car } from "./car";
import { CarConfig } from "./carConfig";
import { Engine } from "./engine";
import { Wheel } from "./wheel";
import { Vector3 } from "three";
import { TestBed, inject } from "@angular/core/testing";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { Physics } from "./physics";

const MS_BETWEEN_FRAMES: number = 16.6667;

/* tslint:disable: no-magic-numbers */
class MockEngine extends Engine {
    public getDriveTorque(): number {
        return 10000;
    }
}

describe("Car", () => {
    // const keyBoardHandler: KeyboardEventHandlerService;
    let car: Car;

    beforeEach(inject([KeyboardEventHandlerService], async (done: () => void, keyBoardHandler: KeyboardEventHandlerService) => {
        TestBed.configureTestingModule({
            providers: [KeyboardEventHandlerService]
        }).compileComponents()
            .then()
            .catch((e: Error) => console.error(e.message));

        car = new Car(keyBoardHandler, true, new MockEngine());
        await car.init(new Vector3(0, 0, 0), Math.PI);

        car.accelerate();
        car.update(MS_BETWEEN_FRAMES);
        car.releaseAccelerator();
        done();
    }));

    it("should be instantiable using default constructor", inject(
        [KeyboardEventHandlerService], (keyBoardHandler: KeyboardEventHandlerService) => {
            car = new Car(keyBoardHandler, true, new MockEngine());
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

    it("should use default engine parameter when none is provided", () => {
        car = new Car(undefined);
        expect(car["_engine"]).toBeDefined();
    });

    it("should use default Wheel parameter when none is provided", inject(
        [KeyboardEventHandlerService], (keyBoardHandler: KeyboardEventHandlerService) => {
            car = new Car(keyBoardHandler, true, new MockEngine(), undefined);
            expect(car["_rearWheel"]).toBeDefined();
        }
    ));

    it("should check validity of wheelbase parameter", inject(
        [KeyboardEventHandlerService], (keyBoardHandler: KeyboardEventHandlerService) => {
            car = new Car(keyBoardHandler, true, new MockEngine(), new Wheel(), 0);
            expect(car["_wheelbase"]).toBe(CarConfig.DEFAULT_WHEELBASE);
        }
    ));

    it("should check validity of mass parameter", inject(
        [KeyboardEventHandlerService], (keyBoardHandler: KeyboardEventHandlerService) => {
            car = new Car(keyBoardHandler, true, new MockEngine(), new Wheel(), CarConfig.DEFAULT_WHEELBASE, 0);
            expect(car["_mass"]).toBe(CarConfig.DEFAULT_MASS);
        }
    ));

    it("should check validity of dragCoefficient parameter", inject(
        [KeyboardEventHandlerService], (keyBoardHandler: KeyboardEventHandlerService) => {
            car = new Car(keyBoardHandler, true, new MockEngine(), new Wheel(), CarConfig.DEFAULT_WHEELBASE, CarConfig.DEFAULT_MASS, -10);
            expect(car["_dragCoefficient"]).toBe(CarConfig.DEFAULT_DRAG_COEFFICIENT);
        }
    ));
});
