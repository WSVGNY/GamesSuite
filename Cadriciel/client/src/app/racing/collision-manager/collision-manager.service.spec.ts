import { TestBed, inject } from "@angular/core/testing";
import { CollisionManagerService } from "./collision-manager.service";
import { Car } from "../car/car";
import { Vector3, Raycaster, Intersection } from "three";

// === TESTS ===
// détecter une collision
// y a t-il des forces résultantes
// anti-clipping movement

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

    it("should ignore the collision detection when cars are far from each others",
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

    it("collision point should be a vertex of the collision emitter's hitbox",
       inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
        firstCar["_mesh"].position.set(1, 0, 1);
        firstCar["_mesh"].updateMatrix();
        const collidingVertex: Vector3 = firstCar.hitbox.subPlanVertices[0].clone().applyMatrix4(firstCar.meshMatrix);
        const collisionPoint: Vector3 = collisionManager["checkIfColliding"](firstCar, secondCar);
        expect(collidingVertex).toEqual(collisionPoint);
    }));

    it("should resolve the hitbox overlap", inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
        firstCar["_mesh"].position.set(1, 0, 1);
        firstCar["_mesh"].updateMatrix();
        collisionManager["collisionEmitter"] = firstCar;
        collisionManager["collisionReceiver"] = secondCar;
        collisionManager["collisionPoint"] = firstCar.hitbox.subPlanVertices[0].clone().applyMatrix4(firstCar.meshMatrix);
        collisionManager["resolveHitboxOverlap"]();
        collisionManager["collisionEmitter"]["_mesh"].updateMatrix();
        collisionManager["collisionReceiver"]["_mesh"].updateMatrix();
        const collidingVertex: Vector3 = collisionManager["collisionReceiver"].hitbox.subPlanVertices[0]
                                        .clone().applyMatrix4(firstCar.meshMatrix);
        const direction: Vector3 = collidingVertex.sub(collisionManager["collisionEmitter"].currentPosition);
        const ray: Raycaster = new Raycaster(collisionManager["collisionEmitter"].currentPosition.clone(), direction.clone().normalize());
        const collisionResult: Intersection[] = ray.intersectObject(collisionManager["collisionReceiver"].hitbox);
        expect(collisionResult.length > 0 && collisionResult[0].distance < direction.length()).toEqual(false);
    }));

    it("collision should be elastic (no energy loss)", inject([CollisionManagerService], (collisionManager: CollisionManagerService) => {
        firstCar["_mesh"].position.set(-2, 0, 1);
        firstCar["_mesh"].updateMatrix();
        collisionManager["collisionEmitter"] = firstCar;
        collisionManager["collisionReceiver"] = secondCar;
        collisionManager["collisionPoint"] = firstCar.hitbox.subPlanVertices[0].clone().applyMatrix4(firstCar.meshMatrix);
        firstCar.speed = new Vector3(0, 0, -5);
        secondCar.speed = new Vector3(0, 0, 0);
        const resultingForces: Vector3[] = collisionManager["computeResultingForces"](
            collisionManager["collisionEmitter"],
            collisionManager["collisionReceiver"],
            collisionManager["collisionPoint"]
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

    it("should push car in the opposite direction it is facing",
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
