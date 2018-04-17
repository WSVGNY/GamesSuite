import { Engine } from "./engine";
import { Vector3 } from "three";
import { TestBed } from "@angular/core/testing";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { Physics } from "./physics";
import { CarStructure } from "./carStructure";
import { Personality } from "../artificial-intelligence/ai-config";
import { AICar } from "./aiCar";
import { DEFAULT_WHEELBASE, DEFAULT_MASS, DEFAULT_DRAG_COEFFICIENT } from "../constants/car.constants";

const MS_BETWEEN_FRAMES: number = 16.6667;

/* tslint:disable: no-magic-numbers */
class MockEngine extends Engine {
    public getDriveTorque(): number {
        return 10000;
    }
}

describe("Car", () => {
    let car: AICar;

    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({
            providers: [KeyboardEventHandlerService]
        }).compileComponents()
            .then()
            .catch((e: Error) => console.error(e.message));

        car = new AICar(0, Personality.Curly, 0, new CarStructure(new MockEngine));
        await car.init(new Vector3(0, 0, 0), Math.PI);

        car.accelerate();
        car.update(MS_BETWEEN_FRAMES);
        car.releaseAccelerator();
        done();
    });

    it("should be instantiable using default constructor", () => {
        expect(car).toBeDefined();
        expect(car.speed.length()).toBeLessThan(0.1);
    });

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

    it("should use default engine parameter when none is provided", () => {
        car = new AICar(0);
        expect(car["_carStructure"].engine).toBeDefined();
    });

    it("should use default Wheel parameter when none is provided", () => {
        car = new AICar(0, Personality.Curly, 0, new CarStructure(new MockEngine), undefined);
        expect(car["_carStructure"].rearWheel).toBeDefined();
    });

    it("should check validity of wheelbase parameter", () => {
        car = new AICar(0, Personality.Curly, 0, new CarStructure(new MockEngine));
        expect(car["_carStructure"].wheelbase).toBe(DEFAULT_WHEELBASE);
    });

    it("should check validity of mass parameter", () => {
        car = new AICar(0, Personality.Curly, 0, new CarStructure(new MockEngine));
        expect(car["_carStructure"].mass).toBe(DEFAULT_MASS);
    });

    it("should check validity of dragCoefficient parameter", () => {
        car = new AICar(0, Personality.Curly, 0, new CarStructure(new MockEngine));
        expect(car["_carStructure"].dragCoefficient).toBe(DEFAULT_DRAG_COEFFICIENT);
    });
});

// describe("Car", () => {
//     it("should not pass to inform that the tests are commented", () => {
//         expect(true).toBeFalsy();
//     });
// });
