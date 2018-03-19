import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { Vector3, Raycaster, Intersection } from "three";
import { VectorHelper } from "../artificial-intelligence/vectorHelper";
import { GameScene } from "../scenes/gameScene";

const MINIMUM_CAR_DISTANCE: number = 5;
@Injectable()
export class CollisionManagerService {

    private collisionAxisHelper: VectorHelper;
    private collisionToFirstCarHelper: VectorHelper;
    private collisionToSecondCarHelper: VectorHelper;

    public constructor() {
        // tslint:disable-next-line:no-magic-numbers
        this.collisionAxisHelper = new VectorHelper(0xFFFFFF);
        this.collisionToFirstCarHelper = new VectorHelper(0x0000FF);
        this.collisionToSecondCarHelper = new VectorHelper(0xFF0000);
    }

    public computeCollisions(cars: Car[], gameScene: GameScene): void {
        for (let i: number = 0; i < cars.length; ++i) {
            for (let j: number = i + 1; j < cars.length; ++j) {
                if (cars[i].currentPosition.distanceTo(cars[j].currentPosition) < MINIMUM_CAR_DISTANCE) {
                    // tslint:disable-next-line:prefer-for-of
                    for (let vertexIndex: number = 0; vertexIndex < cars[i].hitbox.subPlanVertices.length; ++vertexIndex) {
                        const localVertex: Vector3 = cars[i].hitbox.subPlanVertices[vertexIndex].clone();
                        const globalVertex: Vector3 = localVertex.applyMatrix4(cars[i].meshMatrix);
                        const direction: Vector3 = globalVertex.sub(cars[i].currentPosition);
                        const ray: Raycaster = new Raycaster(cars[i].currentPosition.clone(), direction.clone().normalize());
                        const collisionResult: Intersection[] = ray.intersectObject(cars[j].hitbox);
                        if (collisionResult.length > 0 && collisionResult[0].distance < direction.length()) {
                            gameScene.remove(this.collisionToFirstCarHelper);
                            gameScene.remove(this.collisionToSecondCarHelper);
                            const collisionAxis: Vector3 = this.computeCollisionAxis(cars[i], cars[j], collisionResult[0].point);
                            gameScene.add(this.collisionToFirstCarHelper);
                            gameScene.add(this.collisionToSecondCarHelper);
                            gameScene.remove(this.collisionAxisHelper);
                            this.collisionAxisHelper.update(collisionResult[0].point.clone(),
                                                            collisionResult[0].point.clone().add(collisionAxis.clone().multiplyScalar(10)));
                            gameScene.add(this.collisionAxisHelper);
                        }
                    }
                }
            }
        }
    }

    private computeCollisionAxis(firstCar: Car, secondCar: Car, collisionPoint: Vector3): Vector3 {
        const collisionToFirstCar: Vector3 = firstCar.currentPosition.clone().sub(collisionPoint);
        collisionToFirstCar.y = 0;
        const collisionToSecondCar: Vector3 = secondCar.currentPosition.clone().sub(collisionPoint);
        collisionToSecondCar.y = 0;

        this.collisionToFirstCarHelper.update(firstCar.currentPosition.clone().add(new Vector3(0, 0.1, 0)),
                                              collisionPoint.clone().add(new Vector3(0, 0.1, 0)));
        this.collisionToSecondCarHelper.update(secondCar.currentPosition.clone().add(new Vector3(0, 0.1, 0)),
                                               collisionPoint.clone().add(new Vector3(0, 0.1, 0)));

        let halfOfSmallAngle: number = collisionToFirstCar.angleTo(collisionToSecondCar) / 2;
        if (collisionToFirstCar.clone().cross(collisionToSecondCar).y < 0) {
            halfOfSmallAngle = -halfOfSmallAngle;
        }

        const collisionAxis: Vector3 = collisionToFirstCar.clone().normalize().applyAxisAngle(new Vector3(0, 1, 0), halfOfSmallAngle);
        collisionAxis.y = 0;

        return collisionAxis;
    }

    // private computeResultingForces(motionLessCar: Car, movingCar: Car, collisionPoint: Vector3): void {

    // }
}
