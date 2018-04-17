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
    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({
            providers: [SoundManagerService, KeyboardEventHandlerService, InputTimeService]
        });
        firstCar = new AICar(0);
        await firstCar.init(new Vector3(0, 0, 0), Math.PI);
        secondCar = new AICar(1);
        await secondCar.init(new Vector3(0, 0, 0), Math.PI);
        done();
    });

    it("should detect the cars are near each others", () => {
        firstCar["_mesh"].position.set(MINIMUM_CAR_DISTANCE - 0.01, 0, 0);
        CarCollisionManager["setCollisionCars"](firstCar, secondCar);
        expect(CarCollisionManager["checkIfCarsAreClose"]()).toEqual(true);
    });

    it("should ignore the collision detection when cars are far from each others", () => {
        firstCar["_mesh"].position.set(6, 0, 0);
        CarCollisionManager["setCollisionCars"](firstCar, secondCar);
        expect(CarCollisionManager["checkIfCarsAreClose"]()).toEqual(false);
    });

    it("should detect a collision between two cars", () => {
        firstCar["_mesh"].position.set(1, 0, 0);
        CarCollisionManager["setCollisionCars"](firstCar, secondCar);
        const collision: boolean = CarCollisionManager["computeCollisionParameters"]();
        expect(collision).toBe(true);
    });

    it("should detect if cars are colliding in an array of cars that are colliding", inject(
        [SoundManagerService], (_soundManager: SoundManagerService) => {
            const cars: AICar[] = [];
            cars.push(firstCar);
            cars.push(secondCar);
            cars[0].currentPosition.set(1, 0, 0);
            CarCollisionManager.update(cars, _soundManager);
            expect(CarCollisionManager["computeCollisionParameters"]()).toEqual(true);
        }));

    it("should not detect if cars are colliding in an array of cars that aren't colliding", inject(
        [SoundManagerService], (_soundManager: SoundManagerService) => {
            const cars: AICar[] = [];
            cars.push(firstCar);
            cars.push(secondCar);
            cars[0].currentPosition.set(150, 0, MINIMUM_CAR_DISTANCE - 0.01);
            CarCollisionManager.update(cars, _soundManager);
            console.log(cars[0].currentPosition);
            console.log(cars[1].currentPosition);
            console.log(CarCollisionManager["checkIfCarsAreClose"]());
            console.log(CarCollisionManager["computeCollisionParameters"]());
            expect(CarCollisionManager["computeCollisionParameters"]()).toEqual(false);
        }));

    it("collision point should be a vertex of the collision emitter's hitbox", () => {
        // firstCar["_mesh"].position.set(1, 0, 1);
        // firstCar["_mesh"].updateMatrix();
        // const collidingVertex: Vector3 = firstCar.hitbox.bottomPlaneVertices[0].clone().applyMatrix4(firstCar.meshMatrix);
        // const collisionPoint: Vector3 = CarCollisionManager["checkIfColliding"](firstCar, secondCar);
        // expect(collidingVertex).toEqual(collisionPoint);
        expect(false).toBe(true);
    });

    it("should resolve the hitbox overlap", () => {
        // firstCar["_mesh"].position.set(1, 0, 1);
        // firstCar["_mesh"].updateMatrix();
        // CarCollisionManager["_collisionEmitter"] = firstCar;
        // CarCollisionManager["_collisionReceiver"] = secondCar;
        // CarCollisionManager["_collisionPoint"] = firstCar.hitbox.bottomPlaneVertices[0].clone().applyMatrix4(firstCar.meshMatrix);
        // CarCollisionManager["resolveHitboxOverlap"]();
        // CarCollisionManager["_collisionEmitter"]["_mesh"].updateMatrix();
        // CarCollisionManager["_collisionReceiver"]["_mesh"].updateMatrix();
        // const collidingVertex: Vector3 = CarCollisionManager["_collisionReceiver"].hitbox.bottomPlaneVertices[0]
        //     .clone().applyMatrix4(firstCar.meshMatrix);
        // const direction: Vector3 = collidingVertex.sub(CarCollisionManager["_collisionEmitter"].currentPosition);
        // const ray: Raycaster = new Raycaster(
        //     CarCollisionManager["_collisionEmitter"].currentPosition.clone(), direction.clone().normalize());
        // const collisionResult: Intersection[] = ray.intersectObject(CarCollisionManager["_collisionReceiver"].hitbox);
        // expect(collisionResult.length > 0 && collisionResult[0].distance < direction.length()).toEqual(false);
        expect(false).toBe(true);
    });

    it("should create a resulting force in the right direction on the collision emitter", () => {
        // firstCar["_mesh"].position.set(-2, 0, 1);
        // firstCar["_mesh"].updateMatrix();
        // CarCollisionManager["_collisionEmitter"] = firstCar;
        // CarCollisionManager["_collisionReceiver"] = secondCar;
        // CarCollisionManager["_collisionPoint"] = firstCar.hitbox.bottomPlaneVertices[0].clone().applyMatrix4(firstCar.meshMatrix);
        // firstCar.speed = new Vector3(0, 0, -5);
        // secondCar.speed = new Vector3(0, 0, 0);
        // const resultingForces: Vector3[] = CarCollisionManager["computeResultingForces"](
        //     CarCollisionManager["_collisionEmitter"],
        //     CarCollisionManager["_collisionReceiver"],
        //     CarCollisionManager["_collisionPoint"]
        // );
        // expect(resultingForces[0].x).toBeLessThan(0);
        // expect(resultingForces[0].z).toBeLessThan(0);
        expect(false).toBe(true);
    });

    it("should create a resulting force in the right direction on the collision receiver", () => {
        // firstCar["_mesh"].position.set(-2, 0, 1);
        // firstCar["_mesh"].updateMatrix();
        // CarCollisionManager["_collisionEmitter"] = firstCar;
        // CarCollisionManager["_collisionReceiver"] = secondCar;
        // CarCollisionManager["_collisionPoint"] = firstCar.hitbox.bottomPlaneVertices[0].clone().applyMatrix4(firstCar.meshMatrix);
        // firstCar.speed = new Vector3(0, 0, -5);
        // secondCar.speed = new Vector3(0, 0, 0);
        // const resultingForces: Vector3[] = CarCollisionManager["computeResultingForces"](
        //     CarCollisionManager["_collisionEmitter"],
        //     CarCollisionManager["_collisionReceiver"],
        //     CarCollisionManager["_collisionPoint"]
        // );
        // expect(resultingForces[1].x).toBeLessThan(0);
        // expect(resultingForces[1].z).toBeGreaterThan(0);
        expect(false).toBe(true);
    });

    it("collision should be elastic (no energy loss)", () => {
        // firstCar["_mesh"].position.set(-2, 0, 1);
        // firstCar["_mesh"].updateMatrix();
        // CarCollisionManager["_collisionEmitter"] = firstCar;
        // CarCollisionManager["_collisionReceiver"] = secondCar;
        // CarCollisionManager["_collisionPoint"] = firstCar.hitbox.bottomPlaneVertices[0].clone().applyMatrix4(firstCar.meshMatrix);
        // firstCar.speed = new Vector3(0, 0, -5);
        // secondCar.speed = new Vector3(0, 0, 0);
        // const resultingForces: Vector3[] = CarCollisionManager["computeResultingForces"](
        //     CarCollisionManager["_collisionEmitter"],
        //     CarCollisionManager["_collisionReceiver"],
        //     CarCollisionManager["_collisionPoint"]
        // );
        // const forcesBeforeImpact: number = firstCar.speed.length();
        // const forcesAfterImpact: number = (resultingForces[0].clone().add(resultingForces[1])).length();
        // expect(Math.abs(forcesBeforeImpact - forcesAfterImpact)).toBeLessThan(0.0001);
        expect(false).toBe(true);
    });

    it("should push car in the direction it is facing", () => {
        const force: Vector3 = new Vector3(1, 0, -1);
        const zComponent: number = CarCollisionManager["computeSpeedZComponent"](force, firstCar.direction);
        expect(zComponent).toBeGreaterThanOrEqual(0);
    });

    it("should push car in the opposite direction it is facing", () => {
        const force: Vector3 = new Vector3(-1, 0, 1);
        const zComponent: number = CarCollisionManager["computeSpeedZComponent"](force, firstCar.direction);
        expect(zComponent).toBeLessThanOrEqual(0);
    });

    it("should push car to its left", () => {
        const force: Vector3 = new Vector3(1, 0, -1);
        const xComponent: number = CarCollisionManager["computeSpeedXComponent"](force, firstCar.direction);
        expect(xComponent).toBeGreaterThanOrEqual(0);
    });

    it("should push car to its right", () => {
        const force: Vector3 = new Vector3(-1, 0, 1);
        const xComponent: number = CarCollisionManager["computeSpeedXComponent"](force, firstCar.direction);
        expect(xComponent).toBeLessThanOrEqual(0);
    });

});
