import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { Vector3, Raycaster, Intersection} from "three";
import { GameScene } from "../scenes/gameScene";

const MINIMUM_CAR_DISTANCE: number  = 5;

@Injectable()
export class CollisionManagerService {

    public constructor() {}

    // tslint:disable-next-line:max-func-body-length
    public computeCollisions(cars: Car[], gameScene: GameScene): void {
        let secondCarHits: boolean = false;
        for (let firstCarIndex: number = 0; firstCarIndex < cars.length; ++firstCarIndex) {
            for (let secondCarIndex: number = firstCarIndex + 1; secondCarIndex < cars.length; ++secondCarIndex) {
                secondCarHits = false;
                if (cars[firstCarIndex].currentPosition.distanceTo(cars[secondCarIndex].currentPosition) < MINIMUM_CAR_DISTANCE) {
                    let collisionPoint: Vector3;
                    collisionPoint = this.detectCollision(cars[firstCarIndex], cars[secondCarIndex]);
                    if (collisionPoint === undefined) {
                        collisionPoint = this.detectCollision(cars[secondCarIndex], cars[firstCarIndex]);
                        secondCarHits = true;
                    }
                    if (collisionPoint !== undefined) {
                        collisionPoint.y = 0;
                        let closestPoint: Vector3;
                        if (secondCarHits) {
                            closestPoint = this.findClosestPoint(collisionPoint.clone(), cars[firstCarIndex]);
                            closestPoint.y = 0;
                            cars[secondCarIndex].setCurrentPosition(cars[secondCarIndex].currentPosition.clone().add(
                                closestPoint.clone().multiplyScalar(1.2)));
                        } else {
                            closestPoint = this.findClosestPoint(collisionPoint.clone(), cars[secondCarIndex]);
                            closestPoint.y = 0;
                            cars[firstCarIndex].setCurrentPosition(cars[firstCarIndex].currentPosition.clone().add(closestPoint.clone().multiplyScalar(1.2)));
                        }

                        if (cars[firstCarIndex].hitbox._inCollision === false && cars[secondCarIndex].hitbox._inCollision === false) {
                            cars[firstCarIndex].hitbox._inCollision = true;
                            cars[secondCarIndex].hitbox._inCollision = true;
                            const resultingForces: Vector3[] = [];
                            if (secondCarHits) {
                                const forces1: Vector3[] =  this.computeResultingForces(cars[secondCarIndex], cars[firstCarIndex], collisionPoint.clone());
                                const forces2: Vector3[] = this.computeResultingForces(cars[firstCarIndex], cars[secondCarIndex], collisionPoint.clone());
                                resultingForces.push(forces1[0]);
                                resultingForces.push(forces1[1]);
                                resultingForces.push(forces2[0]);
                                resultingForces.push(forces2[1]);
                                this.applyForces(cars[secondCarIndex], cars[firstCarIndex], resultingForces);
                            } else {
                                const forces1: Vector3[] =  this.computeResultingForces(cars[firstCarIndex], cars[secondCarIndex], collisionPoint.clone());
                                const forces2: Vector3[] = this.computeResultingForces(cars[secondCarIndex], cars[firstCarIndex], collisionPoint.clone());
                                resultingForces.push(forces1[0]);
                                resultingForces.push(forces1[1]);
                                resultingForces.push(forces2[0]);
                                resultingForces.push(forces2[1]);
                                this.applyForces(cars[firstCarIndex], cars[secondCarIndex], resultingForces);
                            }
                        }
                    } else {
                        cars[firstCarIndex].hitbox._inCollision = false;
                        cars[secondCarIndex].hitbox._inCollision = false;
                    }
                }
            }
        }
    }

    // tslint:disable-next-line:max-func-body-length
    private findClosestPoint(collisionPoint: Vector3, car: Car): Vector3 {
        let smallestDistance: number = 2e19;
        let pushBack: Vector3;
        // tslint:disable-next-line:prefer-for-of
        for (let i: number = 0; i < car.hitbox.subPlanVertices.length; ++i) {
            const localVertexA: Vector3 = car.hitbox.subPlanVertices[i].clone();
            let localVertexB: Vector3;
            if ((i + 1) === car.hitbox.subPlanVertices.length) {
                localVertexB = car.hitbox.subPlanVertices[0].clone();
            } else {
                localVertexB = car.hitbox.subPlanVertices[i + 1].clone();
            }
            const globalVertexA: Vector3 = localVertexA.applyMatrix4(car.meshMatrix);
            const globalVertexB: Vector3 = localVertexB.applyMatrix4(car.meshMatrix);
            const ap: Vector3 = collisionPoint.clone().sub(globalVertexA);
            const ab: Vector3 = globalVertexB.clone().sub(globalVertexA);
            const proj: Vector3 = ap.clone().projectOnVector(ab);
            const pproj: Vector3 = globalVertexA.clone().add(proj.clone()).sub(collisionPoint);
            const distance: number = pproj.lengthSq();
            if (distance < smallestDistance) {
                smallestDistance = distance;
                pushBack = pproj.clone();
            }
        }

        return pushBack;
    }

    private detectCollision(firstCar: Car, secondCar: Car): Vector3 {
        for (const vertex of firstCar.hitbox.subPlanVertices) {
            const localVertex: Vector3 = vertex.clone();
            const globalVertex: Vector3 = localVertex.applyMatrix4(firstCar.meshMatrix);
            const direction: Vector3 = globalVertex.sub(firstCar.currentPosition);
            const ray: Raycaster = new Raycaster(firstCar.currentPosition.clone(), direction.clone().normalize());
            const collisionResult: Intersection[] = ray.intersectObject(secondCar.hitbox);
            if (collisionResult.length > 0 && collisionResult[0].distance < direction.length()) {
                return firstCar.currentPosition.clone().add(direction);
                // return collisionResult[0].point.clone();
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

    private computeResultingForces(movingCar: Car, motionlessCar: Car, collisionPoint: Vector3): Vector3[] {
        const movingCarSpeed: Vector3 = this.getCarSpeed(movingCar);
        const collisionAxis: Vector3 = this.computeCollisionAxis(movingCar, motionlessCar, collisionPoint);
        const radialForce: Vector3 = this.getRadialForce(movingCarSpeed, collisionAxis);
        const tangentialForce: Vector3 = this.getTangentialForce(movingCarSpeed, collisionAxis);
        const movingCarDirection: Vector3 = movingCar.direction.clone();
        const motionlessCarDirection: Vector3 = motionlessCar.direction.clone();

        const resultingForces: Vector3[] = [];
        const movingCarResultingSpeed: Vector3 = new Vector3(0, 0, 0);
        movingCarResultingSpeed.x = this.computeSpeedXComponent(tangentialForce, movingCarDirection);
        movingCarResultingSpeed.z = this.computeSpeedZComponent(tangentialForce, movingCarDirection);
        resultingForces.push(movingCarResultingSpeed);

        const motionlessCarResultingSpeed: Vector3 = new Vector3(0, 0, 0);
        motionlessCarResultingSpeed.x = this.computeSpeedXComponent(radialForce, motionlessCarDirection);
        motionlessCarResultingSpeed.z = this.computeSpeedZComponent(radialForce, motionlessCarDirection);
        resultingForces.push(motionlessCarResultingSpeed);

        return resultingForces;
    }

    private computeSpeedXComponent(force: Vector3, carDirection: Vector3): number {
        const sign: number = (force.clone().cross(carDirection).y < 0) ? -1 : 1;

        return force.clone().projectOnVector(this.orthogonalVector(carDirection)).length() * sign;
    }

    private computeSpeedZComponent(force: Vector3, carDirection: Vector3): number {
        const sign: number = (force.clone().dot(carDirection) > 0) ? -1 : 1;

        return force.clone().projectOnVector(carDirection).length() * sign;
    }

    private getCarSpeed(movingCar: Car): Vector3 {
        return movingCar.direction.clone().multiplyScalar(-movingCar._speed.z);
    }

    private getTangentialForce(movingCarSpeed: Vector3, collisionAxis: Vector3): Vector3 {
        return movingCarSpeed.clone().projectOnVector(collisionAxis);
    }

    private getRadialForce(movingCarSpeed: Vector3, collisionAxis: Vector3): Vector3 {
        return movingCarSpeed.clone().projectOnVector(this.orthogonalVector(collisionAxis));
    }

    private orthogonalVector(vector: Vector3): Vector3 {
        return new Vector3(vector.z, 0, - vector.x);
    }

    private applyForces(firstCar: Car, secondCar: Car, forces: Vector3[]): void {
        firstCar._speed = forces[0].clone().add(forces[3]);
        secondCar._speed = forces[1].clone().add(forces[2]);
    }
}
