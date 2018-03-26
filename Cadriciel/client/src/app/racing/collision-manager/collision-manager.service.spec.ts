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

    // it("should find the deplacement vector is car1 is Emitter", inject([CollisionManagerService], (service: CollisionManagerService) => {
    //     service["collisionEmitter"] = car1;
    //     service["collisionReceiver"] = car2;
    //     const deplacementVector: Vector3 = service["findDisplacementVector"]();
    //     expect(deplacementVector).toEqual(new Vector3(0, 0, 1)); // Confirmer avec will pour le calcul
    // }));

    // it("should find the deplacement vector is car2 is Emitter", inject([CollisionManagerService], (service: CollisionManagerService) => {
    //     service["collisionEmitter"] = car2;
    //     service["collisionReceiver"] = car1;
    //     const deplacementVector: Vector3 = service["findDisplacementVector"]();
    //     expect(deplacementVector).toEqual(new Vector3(0, 0, 1)); // Confirmer avec will pour le calcul
    // }));

    // it("should find the distance from a simple point to a vector3 segment",
    //    inject([CollisionManagerService], (service: CollisionManagerService) => {
    //         const distance: Vector3 = service["findDistanceToSegment"](new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(1, 0, 1));
    //         expect(distance).toEqual(new Vector3(0, 0, 0));
    // }));

    // it("should find the collision point between two cars", inject([CollisionManagerService], (service: CollisionManagerService) => {
    //         car1["_mesh"].position.set(1, 0, 1);
    //         expect(service["findCollisionPoint"](car1, car2)).toEqual(new Vector3(0.5, 0, 0.5));
    // }));

    // it("should find the axe of collision",
    //    inject([CollisionManagerService], (service: CollisionManagerService) => {
    //         car1["_mesh"].position.set(1, 0, 1);
    //         expect(service["computeCollisionAxis"](car1, car2, service["collisionPoint"])).toEqual(new Vector3(1, 0, 0));
    // }));
});
