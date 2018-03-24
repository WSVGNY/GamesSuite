import { TestBed, inject } from "@angular/core/testing";

import { CollisionManagerService } from "./collision-manager.service";
import { Car } from "../car/car";
import { Vector3 } from "three";

// === TESTS ===
// détecter une collision
// y a t-il des forces résultantes
// anti-clipping movement

describe("CollisionManagerService", () => {

    let car1: Car;
    let car2: Car;
    const cars: Car[] = [];
    const originalTimeout: number = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({
            providers: [CollisionManagerService]
        });
        car1 = new Car(undefined, true);
        await car1.init(new Vector3(0, 0, 0), Math.PI);
        // done();
        car2 = new Car(undefined, true);
        await car2.init(new Vector3(0, 0, 0), Math.PI);
        done();
        cars.push(car1);
        cars.push(car2);
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it("should be created", inject([CollisionManagerService], (service: CollisionManagerService) => {
        expect(service).toBeTruthy();
    }));

    it("shouldn't detect collision", inject([CollisionManagerService], (service: CollisionManagerService) => {
        car1["_mesh"].position.set(10, 23, 5);
        service.computeCollisions(cars);
        expect(service["collisionEmitter"].hitbox.inCollision).toEqual(false);
    }));

    it("should detect collision : Testing if collision is detected only (not the physics)",
       inject([CollisionManagerService], (service: CollisionManagerService) => {
            service.computeCollisions(cars);
            expect(service["collisionEmitter"].hitbox.inCollision).toEqual(true);
        }));

    it("should compute speed direction for the First car", inject([CollisionManagerService], (service: CollisionManagerService) => {
        car1["_mesh"].position.set(1, 0, 1);
        service.computeCollisions(cars);
        expect(car1.speed).toEqual(service["computeResultingForces"](car1, car2, service["collisionPoint"]));
    }));

    it("should compute speed direction for the second car", inject([CollisionManagerService], (service: CollisionManagerService) => {
        car2["_mesh"].position.set(1, 0, 1);
        service.computeCollisions(cars);
        expect(car2.speed).toEqual(service["computeResultingForces"](car2, car1, service["collisionPoint"]));
    }));

    it("should find the deplacement vector is car1 is Emitter", inject([CollisionManagerService], (service: CollisionManagerService) => {
        service["collisionEmitter"] = car1;
        service["collisionReceiver"] = car2;
        const deplacementVector: Vector3 = service["findDisplacementVector"]();
        expect(deplacementVector).toEqual(new Vector3(0, 0, 1)); // Confirmer avec will pour le calcul
    }));

    it("should find the deplacement vector is car2 is Emitter", inject([CollisionManagerService], (service: CollisionManagerService) => {
        service["collisionEmitter"] = car2;
        service["collisionReceiver"] = car1;
        const deplacementVector: Vector3 = service["findDisplacementVector"]();
        expect(deplacementVector).toEqual(new Vector3(0, 0, 1)); // Confirmer avec will pour le calcul
    }));

    it("should find the distance from a simple point to a vector3 segment",
       inject([CollisionManagerService], (service: CollisionManagerService) => {
            const distance: Vector3 = service["findDistanceToSegment"](new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(1, 0, 1));
            expect(distance).toEqual(new Vector3(0, 0, 0));
    }));

    it("should find the collision point between two cars", inject([CollisionManagerService], (service: CollisionManagerService) => {
            car1["_mesh"].position.set(1, 0, 1);
            expect(service["findCollisionPoint"](car1, car2)).toEqual(new Vector3(0.5, 0, 0.5));
    }));

    it("should when two car are colliding who is the Emitter and the reciever and return the sum on the emitter position and the direction",
       inject([CollisionManagerService], (service: CollisionManagerService) => {
            car1["_mesh"].position.set(1, 0, 1);
            expect(service["checkIfColliding"](car1, car2)).toEqual(new Vector3(1.75, 0, 1.75));
    }));


});
