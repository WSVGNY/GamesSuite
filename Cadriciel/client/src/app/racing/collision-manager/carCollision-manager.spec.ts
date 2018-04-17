import { AICar } from "../car/aiCar";
import { TestBed, inject } from "@angular/core/testing";
import { Vector3 } from "three";
import { CarCollisionManager } from "./carCollision-manager";
import { MINIMUM_CAR_DISTANCE } from "../constants/car.constants";
import { SoundManagerService } from "../sound-service/sound-manager.service";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { InputTimeService } from "../scoreboard/input-time/input-time.service";

// tslint:disable:no-magic-numbers
describe("Car collision Manager Service", () => {

    let firstCar: AICar;
    let secondCar: AICar;
    let cars: AICar[];
    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({
            providers: [SoundManagerService, KeyboardEventHandlerService, InputTimeService]
        });
        firstCar = new AICar(0);
        await firstCar.init(new Vector3(0, 0, 0), Math.PI);
        firstCar["_hitbox"].updatePosition(firstCar.currentPosition, firstCar["_mesh"].matrix);
        secondCar = new AICar(1);
        await secondCar.init(new Vector3(0, 0, 0), Math.PI);
        secondCar["_hitbox"].updatePosition(secondCar.currentPosition, secondCar["_mesh"].matrix);
        cars = [];
        cars.push(firstCar);
        cars.push(secondCar);
        done();
    });

    it("should detect the cars are near each others", () => {
        firstCar.setCurrentPosition(new Vector3(MINIMUM_CAR_DISTANCE - 0.01, 0, 0));
        firstCar["_mesh"].updateMatrix();
        firstCar["_hitbox"].updatePosition(firstCar.currentPosition, firstCar["_mesh"].matrix);
        CarCollisionManager["setCollisionCars"](firstCar, secondCar);
        expect(CarCollisionManager["checkIfCarsAreClose"]()).toEqual(true);
    });

    it("should ignore the collision detection when cars are far from each others", () => {
        firstCar.setCurrentPosition(new Vector3(6, 0, 0));
        firstCar["_mesh"].updateMatrix();
        CarCollisionManager["setCollisionCars"](firstCar, secondCar);
        expect(CarCollisionManager["checkIfCarsAreClose"]()).toEqual(false);
    });

    it("should detect a collision between two cars", () => {
        firstCar.setCurrentPosition(new Vector3(1, 0, 0));
        firstCar["_mesh"].updateMatrix();
        firstCar["_hitbox"].updatePosition(firstCar.currentPosition, firstCar["_mesh"].matrix);
        CarCollisionManager["setCollisionCars"](firstCar, secondCar);
        const collision: boolean = CarCollisionManager["computeCollisionParameters"]();
        expect(collision).toBe(true);
    });

    it("should detect if cars are colliding in an array of cars that are colliding", inject(
        [SoundManagerService], (_soundManager: SoundManagerService) => {
            cars[0].setCurrentPosition(new Vector3(1, 0, 0));
            cars[0]["_mesh"].updateMatrix();
            cars[0]["_hitbox"].updatePosition(cars[0].currentPosition, cars[0]["_mesh"].matrix);
            CarCollisionManager.update(cars, _soundManager);
            expect(cars[0].hitbox.inCollision).toEqual(true);
        }));

    it("should not detect if cars are colliding in an array of cars that aren't colliding", inject(
        [SoundManagerService], (_soundManager: SoundManagerService) => {
            cars[0].setCurrentPosition(new Vector3(0, 0, MINIMUM_CAR_DISTANCE));
            cars[0]["_mesh"].updateMatrix();
            cars[0]["_hitbox"].updatePosition(cars[0].currentPosition, cars[0]["_mesh"].matrix);
            CarCollisionManager.update(cars, _soundManager);
            expect(cars[0].hitbox.inCollision).toEqual(false);
        }));

    it("should resolve the hitbox overlap", inject(
        [SoundManagerService], (_soundManager: SoundManagerService) => {
            cars[0].setCurrentPosition(new Vector3(0, 0, 2.75));
            cars[0]["_mesh"].updateMatrix();
            cars[0].hitbox.updatePosition(new Vector3(0, 0, 2.75), cars[0]["_mesh"].matrix);
            CarCollisionManager.update(cars, _soundManager);
            expect(cars[0].currentPosition).not.toEqual(new Vector3(0, 0, 2.75));
        }));

    it("should change speed of first car", inject(
        [SoundManagerService], (_soundManager: SoundManagerService) => {
            cars[0].setCurrentPosition(new Vector3(0, 0, 2.75));
            cars[0]["_carControls"].speed.add(new Vector3(0, 0, 5));
            cars[0]["_mesh"].updateMatrix();
            cars[0].hitbox.updatePosition(new Vector3(0, 0, 2.75), cars[0]["_mesh"].matrix);

            CarCollisionManager.update(cars, _soundManager);
            expect(cars[0].speed).not.toEqual(new Vector3(0, 0, 5));
        }));

    it("should change speed of second car", inject(
        [SoundManagerService], (_soundManager: SoundManagerService) => {
            cars[0].setCurrentPosition(new Vector3(0, 0, 2.75));
            cars[0]["_carControls"].speed.add(new Vector3(0, 0, 5));
            cars[0]["_mesh"].updateMatrix();
            cars[0].hitbox.updatePosition(new Vector3(0, 0, 2.75), cars[0]["_mesh"].matrix);

            CarCollisionManager.update(cars, _soundManager);
            expect(cars[1].speed).not.toEqual(new Vector3(0, 0, 0));
        }));

    it("collision should be elastic (no energy loss)", inject(
        [SoundManagerService], (_soundManager: SoundManagerService) => {
            cars[0].setCurrentPosition(new Vector3(0, 0, 2.75));
            cars[0]["_carControls"].speed.add(new Vector3(0, 0, 5));
            cars[0]["_mesh"].updateMatrix();
            cars[0].hitbox.updatePosition(new Vector3(0, 0, 2.75), cars[0]["_mesh"].matrix);

            CarCollisionManager.update(cars, _soundManager);
            expect(Math.abs(cars[1].speed.length() + cars[0].speed.length())).toEqual(5);
        }));

    it("should push car in the direction it is facing", () => {
        const force: Vector3 = new Vector3(0, 0, -1);
        const zComponent: number = CarCollisionManager["computeSpeedZComponent"](force, firstCar.direction);
        expect(zComponent).toBeGreaterThanOrEqual(0);
    });

    it("should push car in the opposite direction it is facing", () => {
        const force: Vector3 = new Vector3(0, 0, 1);
        const zComponent: number = CarCollisionManager["computeSpeedZComponent"](force, firstCar.direction);
        expect(zComponent).toBeLessThanOrEqual(0);
    });

    it("should push car to its left", () => {
        const force: Vector3 = new Vector3(-1, 0, 0);
        const xComponent: number = CarCollisionManager["computeSpeedXComponent"](force, firstCar.direction);
        expect(xComponent).toBeGreaterThanOrEqual(0);
    });

    it("should push car to its right", () => {
        const force: Vector3 = new Vector3(1, 0, 0);
        const xComponent: number = CarCollisionManager["computeSpeedXComponent"](force, firstCar.direction);
        expect(xComponent).toBeLessThanOrEqual(0);
    });

});
