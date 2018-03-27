import { TestBed, inject } from "@angular/core/testing";
import { CollisionManagerService } from "./collision-manager.service";
import { Car } from "../car/car";
import { Vector3, Raycaster, Intersection } from "three";
import { first } from "rxjs/operators";

// tslint:disable:no-magic-numbers
describe("Collision Manager Service", () => {

    let firstCar: Car;
    let secondCar: Car;
    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({
            providers: [CollisionManagerService]
        });
        firstCar = new Car(undefined, true);
        await firstCar.init(new Vector3(0, 0, 0), Math.PI);
        secondCar = new Car(undefined, true);
        await secondCar.init(new Vector3(0, 0, 0), Math.PI);
        done();
    });

    it("should be created", inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
        expect(collisionManager).toBeTruthy();
    }));

    it("should detect the cars are near each others", inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
        firstCar["_mesh"].position.set(4, 0, 0);
        expect(collisionManager["checkIfCarsAreClose"](firstCar, secondCar)).toEqual(true);
    }));

    it(
        "should ignore the collision detection when cars are far from each others",
        inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
            firstCar["_mesh"].position.set(6, 0, 0);
            expect(collisionManager["checkIfCarsAreClose"](firstCar, secondCar)).toEqual(false);
        }));

    it("should detect a collision between two cars", inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
        firstCar["_mesh"].position.set(1, 0, 0);
        firstCar["_mesh"].updateMatrix();
        const collisionPoint: Vector3 = collisionManager["checkIfColliding"](firstCar, secondCar);
        expect(collisionPoint).toBeDefined();
    }));

    it("should detect if cars are colliding in an array of cars that are colliding",
       inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
        const cars: Car[] = [];
        cars.push(firstCar);
        cars.push(secondCar);
        cars[0]["_mesh"].position.set(1, 0, 0);
        cars[0]["_mesh"].updateMatrix();
        collisionManager.update(cars);
        expect(collisionManager["shouldPlaySound"]).toEqual(true);
    }));

    it("should not detect if cars are colliding in an array of cars that aren't colliding",
       inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
        const cars: Car[] = [];
        cars.push(firstCar);
        cars.push(secondCar);
        cars[0]["_mesh"].position.set(2, 0, 5);
        cars[0]["_mesh"].updateMatrix();
        collisionManager.update(cars);
        expect(collisionManager["shouldPlaySound"]).toEqual(false);
    }));

    it(
        "collision point should be a vertex of the collision emitter's hitbox",
        inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
            firstCar["_mesh"].position.set(1, 0, 1);
            firstCar["_mesh"].updateMatrix();
            const collidingVertex: Vector3 = firstCar.hitbox.bottomPlaneVertices[0].clone().applyMatrix4(firstCar.meshMatrix);
            const collisionPoint: Vector3 = collisionManager["checkIfColliding"](firstCar, secondCar);
            expect(collidingVertex).toEqual(collisionPoint);
        }));

    it("should resolve the hitbox overlap", inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
        firstCar["_mesh"].position.set(1, 0, 1);
        firstCar["_mesh"].updateMatrix();
        collisionManager["_collisionEmitter"] = firstCar;
        collisionManager["_collisionReceiver"] = secondCar;
        collisionManager["_collisionPoint"] = firstCar.hitbox.bottomPlaneVertices[0].clone().applyMatrix4(firstCar.meshMatrix);
        collisionManager["resolveHitboxOverlap"]();
        collisionManager["_collisionEmitter"]["_mesh"].updateMatrix();
        collisionManager["_collisionReceiver"]["_mesh"].updateMatrix();
        const collidingVertex: Vector3 = collisionManager["_collisionReceiver"].hitbox.bottomPlaneVertices[0]
            .clone().applyMatrix4(firstCar.meshMatrix);
        const direction: Vector3 = collidingVertex.sub(collisionManager["_collisionEmitter"].currentPosition);
        const ray: Raycaster = new Raycaster(collisionManager["_collisionEmitter"].currentPosition.clone(), direction.clone().normalize());
        const collisionResult: Intersection[] = ray.intersectObject(collisionManager["_collisionReceiver"].hitbox);
        expect(collisionResult.length > 0 && collisionResult[0].distance < direction.length()).toEqual(false);
    }));

    it(
        "should create a resulting force in the right direction on the collision emitter",
        inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
            firstCar["_mesh"].position.set(-2, 0, 1);
            firstCar["_mesh"].updateMatrix();
            collisionManager["_collisionEmitter"] = firstCar;
            collisionManager["_collisionReceiver"] = secondCar;
            collisionManager["_collisionPoint"] = firstCar.hitbox.bottomPlaneVertices[0].clone().applyMatrix4(firstCar.meshMatrix);
            firstCar.speed = new Vector3(0, 0, -5);
            secondCar.speed = new Vector3(0, 0, 0);
            const resultingForces: Vector3[] = collisionManager["computeResultingForces"](
                collisionManager["_collisionEmitter"],
                collisionManager["_collisionReceiver"],
                collisionManager["_collisionPoint"]
            );
            expect(resultingForces[0].x).toBeLessThan(0);
            expect(resultingForces[0].z).toBeLessThan(0);
        }));

    it(
        "should create a resulting force in the right direction on the collision receiver",
        inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
            firstCar["_mesh"].position.set(-2, 0, 1);
            firstCar["_mesh"].updateMatrix();
            collisionManager["_collisionEmitter"] = firstCar;
            collisionManager["_collisionReceiver"] = secondCar;
            collisionManager["_collisionPoint"] = firstCar.hitbox.bottomPlaneVertices[0].clone().applyMatrix4(firstCar.meshMatrix);
            firstCar.speed = new Vector3(0, 0, -5);
            secondCar.speed = new Vector3(0, 0, 0);
            const resultingForces: Vector3[] = collisionManager["computeResultingForces"](
                collisionManager["_collisionEmitter"],
                collisionManager["_collisionReceiver"],
                collisionManager["_collisionPoint"]
            );
            expect(resultingForces[1].x).toBeLessThan(0);
            expect(resultingForces[1].z).toBeGreaterThan(0);
        }));

    it("collision should be elastic (no energy loss)", inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
        firstCar["_mesh"].position.set(-2, 0, 1);
        firstCar["_mesh"].updateMatrix();
        collisionManager["_collisionEmitter"] = firstCar;
        collisionManager["_collisionReceiver"] = secondCar;
        collisionManager["_collisionPoint"] = firstCar.hitbox.bottomPlaneVertices[0].clone().applyMatrix4(firstCar.meshMatrix);
        firstCar.speed = new Vector3(0, 0, -5);
        secondCar.speed = new Vector3(0, 0, 0);
        const resultingForces: Vector3[] = collisionManager["computeResultingForces"](
            collisionManager["_collisionEmitter"],
            collisionManager["_collisionReceiver"],
            collisionManager["_collisionPoint"]
        );
        const forcesBeforeImpact: number = firstCar.speed.length();
        const forcesAfterImpact: number = (resultingForces[0].clone().add(resultingForces[1])).length();
        expect(Math.abs(forcesBeforeImpact - forcesAfterImpact)).toBeLessThan(0.0001);
    }));

    it("should push car in the direction it is facing", inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
        const force: Vector3 = new Vector3(1, 0, 1);
        const zComponent: number = collisionManager["computeSpeedZComponent"](force, firstCar.direction);
        expect(zComponent).toBeGreaterThanOrEqual(0);
    }));

    it(
        "should push car in the opposite direction it is facing",
        inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
            const force: Vector3 = new Vector3(-1, 0, -1);
            const zComponent: number = collisionManager["computeSpeedZComponent"](force, firstCar.direction);
            expect(zComponent).toBeLessThanOrEqual(0);
        }));

    it("should push car to its left", inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
        const force: Vector3 = new Vector3(1, 0, 1);
        const xComponent: number = collisionManager["computeSpeedXComponent"](force, firstCar.direction);
        expect(xComponent).toBeGreaterThanOrEqual(0);
    }));

    it("should push car to its right", inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
        const force: Vector3 = new Vector3(-1, 0, -1);
        const xComponent: number = collisionManager["computeSpeedXComponent"](force, firstCar.direction);
        expect(xComponent).toBeLessThanOrEqual(0);
    }));

});
