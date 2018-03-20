import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { Vector3, Raycaster, Intersection } from "three";
// import { VectorHelper } from "../artificial-intelligence/vectorHelper";
import { GameScene } from "../scenes/gameScene";

const MINIMUM_CAR_DISTANCE: number  = 5;
@Injectable()
export class CollisionManagerService {

    // private collisionAxisHelper: VectorHelper;
    // private collisionAxisOrthoHelper: VectorHelper;
    // private collisionToFirstCarHelper: VectorHelper;
    // private collisionToSecondCarHelper: VectorHelper;

    public constructor() {
        // tslint:disable-next-line:no-magic-numbers
        // this.collisionAxisHelper = new VectorHelper(0xFFFFFF);
        // this.collisionToFirstCarHelper = new VectorHelper(0x0000FF);
        // this.collisionToSecondCarHelper = new VectorHelper(0xFF0000);
        // this.collisionAxisOrthoHelper = new VectorHelper(0xFF00FF);
    }

    public computeCollisions(cars: Car[], gameScene: GameScene): void {
        for (let i: number = 0; i < cars.length; ++i) {
            for (let j: number = i + 1; j < cars.length; ++j) {
                if (cars[i].currentPosition.distanceTo(cars[j].currentPosition) < MINIMUM_CAR_DISTANCE) {
                    const collisionPoint: Vector3 = this.detectCollision(cars[i], cars[j]);
                    if (collisionPoint !== undefined) {
                        const collisionAxis: Vector3 = this.computeCollisionAxis(cars[i], cars[j], collisionPoint);
                        const collisionAxisOrtho: Vector3 = new Vector3(collisionAxis.z, 0, - collisionAxis.x);
                        // const tangencialComponent: Vector3 = cars[i]._speed.clone().projectOnVector(collisionAxis);
                        const radialComponent: Vector3 = cars[i]._speed.clone().projectOnVector(collisionAxisOrtho);

                        cars[i]._speed.sub(radialComponent);
                        cars[j]._speed.add(radialComponent);
                    }
                }
            }
        }
    }

    private detectCollision(firstCar: Car, secondCar: Car): Vector3 {
        for (const vertex of firstCar.hitbox.subPlanVertices) {
            const localVertex: Vector3 = vertex.clone();
            const globalVertex: Vector3 = localVertex.applyMatrix4(firstCar.meshMatrix);
            const direction: Vector3 = globalVertex.sub(firstCar.currentPosition);
            const ray: Raycaster = new Raycaster(firstCar.currentPosition.clone(), direction.clone().normalize());
            const collisionResult: Intersection[] = ray.intersectObject(secondCar.hitbox);
            if (collisionResult.length > 0 && collisionResult[0].distance < direction.length()) {
                return collisionResult[0].point;
            }
        }

        return undefined;
    }

    private computeCollisionAxis(firstCar: Car, secondCar: Car, collisionPoint: Vector3): Vector3 {
        const collisionToFirstCar: Vector3 = firstCar.currentPosition.clone().sub(collisionPoint);
        const collisionToSecondCar: Vector3 = secondCar.currentPosition.clone().sub(collisionPoint);
        collisionToFirstCar.y = 0;
        collisionToSecondCar.y = 0;

        let halfOfSmallAngle: number = collisionToFirstCar.angleTo(collisionToSecondCar) / 2;
        if (collisionToFirstCar.clone().cross(collisionToSecondCar).y < 0) {
            halfOfSmallAngle = -halfOfSmallAngle;
        }
        const collisionAxis: Vector3 = collisionToFirstCar.clone().normalize().applyAxisAngle(new Vector3(0, 1, 0), halfOfSmallAngle);
        collisionAxis.y = 0;

        return collisionAxis;
    }
}
