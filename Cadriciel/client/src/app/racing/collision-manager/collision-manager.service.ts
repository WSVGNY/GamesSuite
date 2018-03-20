import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { Vector3, Raycaster, Intersection } from "three";
import { VectorHelper } from "../artificial-intelligence/vectorHelper";
import { GameScene } from "../scenes/gameScene";

const MINIMUM_CAR_DISTANCE: number  = 5;
const RED: number = 0xFF0000;
const GREEN: number = 0x00FF00;
const BLUE: number = 0x0000FF;
const CYAN: number = 0x00FFFF;
const PINK: number = 0xFF00FF;
const YELLOW: number = 0xFFFF00;
const WHITE: number = 0xFFFFFF;

@Injectable()
export class CollisionManagerService {

    private collisionAxisHelper: VectorHelper;
    private collisionAxisOrthoHelper: VectorHelper;
    private collisionToFirstCarHelper: VectorHelper;
    private collisionToSecondCarHelper: VectorHelper;
    private radialComponentHelper: VectorHelper;
    private carSpeedHelper: VectorHelper;
    private a: number = 0;

    public constructor() {
        this.collisionAxisHelper = new VectorHelper(WHITE);
        this.collisionAxisOrthoHelper = new VectorHelper(YELLOW);
        this.collisionToFirstCarHelper = new VectorHelper(CYAN);
        this.collisionToSecondCarHelper = new VectorHelper(BLUE);
        this.radialComponentHelper = new VectorHelper(RED);
        this.carSpeedHelper = new VectorHelper(PINK);
    }

    public computeCollisions(cars: Car[], gameScene: GameScene): void {
        for (let i: number = 0; i < cars.length; ++i) {
            for (let j: number = i + 1; j < cars.length; ++j) {
                const firstCarSpeed: Vector3 = cars[i].direction.clone().multiplyScalar(- cars[i]._speed.z);
                gameScene.remove(this.carSpeedHelper);
                this.carSpeedHelper.update(cars[i].currentPosition, cars[i].currentPosition.clone().add(firstCarSpeed));
                gameScene.add(this.carSpeedHelper);

                if (cars[i].currentPosition.distanceTo(cars[j].currentPosition) < MINIMUM_CAR_DISTANCE) {
                    const collisionPoint: Vector3 = this.detectCollision(cars[i], cars[j]);
                    if (collisionPoint !== undefined) {
                        this.computeCollisionAxis(cars[i], cars[j], collisionPoint, gameScene);

                    }
                }
            }
        }
        this.a++;
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

        const firstCarSpeed: Vector3 = firstCar.direction.clone().multiplyScalar(- firstCar._speed.z);

        gameScene.remove(this.collisionToFirstCarHelper);
        gameScene.remove(this.collisionToSecondCarHelper);

        this.collisionToFirstCarHelper.update(firstCar.currentPosition.clone().add(new Vector3(0, 0.1, 0)),
                                              collisionPoint.clone().add(new Vector3(0, 0.1, 0)));
        this.collisionToSecondCarHelper.update(secondCar.currentPosition.clone().add(new Vector3(0, 0.1, 0)),
                                               collisionPoint.clone().add(new Vector3(0, 0.1, 0)));

        gameScene.add(this.collisionToFirstCarHelper);
        gameScene.add(this.collisionToSecondCarHelper);

        let halfOfSmallAngle: number = collisionToFirstCar.angleTo(collisionToSecondCar) / 2;
        if (collisionToFirstCar.clone().cross(collisionToSecondCar).y < 0) {
            halfOfSmallAngle = -halfOfSmallAngle;
        }
        const collisionAxis: Vector3 = collisionToFirstCar.clone().normalize().applyAxisAngle(new Vector3(0, 1, 0), halfOfSmallAngle);
        collisionAxis.y = 0;
        const collisionAxisOrtho: Vector3 = new Vector3(collisionAxis.z, 0, - collisionAxis.x);
        const radialComponent: Vector3 = firstCarSpeed.clone().projectOnVector(collisionAxisOrtho);

        gameScene.remove(this.collisionAxisHelper);
        gameScene.remove(this.collisionAxisOrthoHelper);
        gameScene.remove(this.radialComponentHelper);
        this.collisionAxisHelper.update(collisionPoint.clone().add(new Vector3(0, 0.1, 0)),
                                        collisionPoint.clone().add(new Vector3(0, 0.1, 0)).add(collisionAxis.clone().multiplyScalar(10)));
        this.collisionAxisOrthoHelper.update(collisionPoint.clone().add(new Vector3(0, 0.1, 0)),
                                             collisionPoint.clone().add(new Vector3(0, 0.1, 0)).add(
                                                 collisionAxisOrtho.clone().multiplyScalar(10)));
        this.radialComponentHelper.update(firstCar.currentPosition.clone().add(new Vector3(0, 0.1, 0)),
                                          firstCar.currentPosition.clone().add(new Vector3(0, 0.1, 0)).add(radialComponent.clone()));
        gameScene.add(this.collisionAxisHelper);
        gameScene.add(this.collisionAxisOrthoHelper);
        gameScene.add(this.radialComponentHelper);
        firstCar._speed.add(radialComponent);
        secondCar._speed.sub(radialComponent);
    }
}
