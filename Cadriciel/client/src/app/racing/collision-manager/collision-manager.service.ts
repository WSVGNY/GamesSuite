import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { Vector3, Raycaster, Intersection } from "three";
import { VectorHelper } from "../artificial-intelligence/vectorHelper";
import { GameScene } from "../scenes/gameScene";

const MINIMUM_CAR_DISTANCE: number  = 5;
@Injectable()
export class CollisionManagerService {

    private collisionAxisHelper: VectorHelper;
    private collisionAxisOrthoHelper: VectorHelper;
    // private collisionToFirstCarHelper: VectorHelper;
    // private collisionToSecondCarHelper: VectorHelper;

    public constructor() {
        this.collisionAxisHelper = new VectorHelper(0xFFFFFF);
        this.collisionAxisOrthoHelper = new VectorHelper(0xFF00FF);
        // this.collisionToFirstCarHelper = new VectorHelper(0x0000FF);
        // this.collisionToSecondCarHelper = new VectorHelper(0xFF0000);
    }

    public computeCollisions(cars: Car[], gameScene: GameScene): void {
        for (let i: number = 0; i < cars.length; ++i) {
            for (let j: number = i + 1; j < cars.length; ++j) {
                if (cars[i].currentPosition.distanceTo(cars[j].currentPosition) < MINIMUM_CAR_DISTANCE) {
                    const collisionPoint: Vector3 = this.detectCollision(cars[i], cars[j]);
                    if (collisionPoint !== undefined) {
                        this.computeCollisionAxis(cars[i], cars[j], collisionPoint, gameScene);

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

    // tslint:disable-next-line:max-func-body-length
    private computeCollisionAxis(firstCar: Car, secondCar: Car, collisionPoint: Vector3, gameScene: GameScene): void {
        const collisionToFirstCar: Vector3 = firstCar.currentPosition.clone().sub(collisionPoint);
        const collisionToSecondCar: Vector3 = secondCar.currentPosition.clone().sub(collisionPoint);
        collisionToFirstCar.y = 0;
        collisionToSecondCar.y = 0;

        let invert: boolean = false;
        let halfOfSmallAngle: number = collisionToFirstCar.angleTo(collisionToSecondCar) / 2;
        if (collisionToFirstCar.clone().cross(collisionToSecondCar).y < 0) {
            halfOfSmallAngle = -halfOfSmallAngle;
            invert = true;
        }
        const collisionAxis: Vector3 = collisionToFirstCar.clone().normalize().applyAxisAngle(new Vector3(0, 1, 0), halfOfSmallAngle);
        collisionAxis.y = 0;
        if (invert) {
            collisionAxis.negate();
        }
        const collisionAxisOrtho: Vector3 = new Vector3(collisionAxis.z, 0, - collisionAxis.x);
        gameScene.remove(this.collisionAxisHelper);
        gameScene.remove(this.collisionAxisOrthoHelper);

        this.collisionAxisHelper.update(collisionPoint.clone().add(new Vector3(0, 0.1, 0)),
                                        collisionPoint.clone().add(new Vector3(0, 0.1, 0)).add(collisionAxis.clone().multiplyScalar(10)));
        this.collisionAxisOrthoHelper.update(collisionPoint.clone().add(new Vector3(0, 0.1, 0)),
                                             // tslint:disable-next-line:max-line-length
                                             collisionPoint.clone().add(new Vector3(0, 0.1, 0)).add(collisionAxisOrtho.clone().multiplyScalar(10)));

        gameScene.add(this.collisionAxisHelper);
        gameScene.add(this.collisionAxisOrthoHelper);

        // const tangencialComponent: Vector3 = cars[i]._speed.clone().projectOnVector(collisionAxis);
        const radialComponent: Vector3 = firstCar._speed.clone().projectOnVector(collisionAxisOrtho);
        if (invert) {
            radialComponent.negate();

        }
        // console.log(radialComponent);
        // if (invert) {
        //     // firstCar._speed.sub(radialComponent);
        //     // secondCar._speed.add(radialComponent.clone().negate());
        //     alert("inverted");
        // } else {
        //     alert("regular");
        //     // firstCar._speed.sub(radialComponent);
        //     // secondCar._speed.add(radialComponent);
        // }
        // return collisionAxis;
        firstCar._speed.sub(radialComponent);
        secondCar._speed.add(radialComponent);
    }
}
