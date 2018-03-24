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
    // let car2: Car;
    const cars: Car[] = [];
    beforeEach(async (done: () => void) => {
        TestBed.configureTestingModule({
            providers: [CollisionManagerService]
        });
        car1 = new Car(undefined, true);
        await car1.init(new Vector3(0, 0, 0), Math.PI);
        done();
        // car2 = new Car(undefined, true);
        //await car2.init(new Vector3(0, 0, 0), Math.PI);
        // done();
        // cars.push(car1);
        // cars.push(car2);
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

    it("should detect speed direction is collision", inject([CollisionManagerService], (service: CollisionManagerService) => {
        service.computeCollisions(cars);
        expect(service["collisionEmitter"].hitbox.inCollision).toEqual(true);
        }));
});
