import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { Vector3, Raycaster, Intersection} from "three";

const MINIMUM_CAR_DISTANCE: number = 5;

// === TESTS ===
// détecter une collision
// y a t-il des forces résultantes
// anti-clipping movement

@Injectable()
export class CollisionManagerService {

    private collisionEmitter: Car;
    private collisionReceiver: Car;
    private collisionPoint: Vector3;
    public isInCollision: boolean = false;

    public constructor() {}

    // tslint:disable-next-line:max-func-body-length
    public computeCollisions(cars: Car[]): void {
        for (let firstCarIndex: number = 0; firstCarIndex < cars.length; ++firstCarIndex) {
            for (let secondCarIndex: number = firstCarIndex + 1; secondCarIndex < cars.length; ++secondCarIndex) {
                if (cars[firstCarIndex].currentPosition.distanceTo(cars[secondCarIndex].currentPosition) < MINIMUM_CAR_DISTANCE) {
                    this.collisionPoint = this.findCollisionPoint(cars[firstCarIndex], cars[secondCarIndex]);
                    if (this.collisionPoint !== undefined) {
                        this.collisionPoint.y = 0;
                        this.resolveHitboxOverlap();

                        if (this.collisionEmitter.hitbox._inCollision === false && this.collisionReceiver.hitbox._inCollision === false) {
                            this.collisionEmitter.hitbox._inCollision = true;
                            this.collisionReceiver.hitbox._inCollision = true;
                            this.isInCollision = true;
                            const resultingForces: Vector3[] = [];
                            const forces1: Vector3[] = this.computeResultingForces(
                                this.collisionEmitter,
                                this.collisionReceiver,
                                this.collisionPoint.clone()
                            );
                            const forces2: Vector3[] = this.computeResultingForces(
                                this.collisionReceiver,
                                this.collisionEmitter,
                                this.collisionPoint.clone()
                            );
                            resultingForces.push(forces1[0]);
                            resultingForces.push(forces1[1]);
                            resultingForces.push(forces2[0]);
                            resultingForces.push(forces2[1]);
                            this.applyForces(this.collisionEmitter, this.collisionReceiver, resultingForces);
                        }
                    } else {
                        cars[firstCarIndex].hitbox._inCollision = false;
                        cars[secondCarIndex].hitbox._inCollision = false;
                        this.isInCollision = false;
                    }
                }
            }
        }
    }

    public get inCollision(): boolean {
        return this.isInCollision;
    }

    private resolveHitboxOverlap(): void {
        const displacement: Vector3 = this.findDisplacementVector();
        displacement.y = 0;
        this.collisionEmitter.setCurrentPosition(
            this.collisionEmitter.currentPosition.clone()
            .add(displacement.clone()
            // .normalize()
            .multiplyScalar(2)
        ));
    }

    private findDisplacementVector(): Vector3 {
        let smallestDistance: number = 2e19;
        let displacement: Vector3;
        for (let i: number = 0; i < this.collisionReceiver.hitbox.subPlanVertices.length; ++i) {
            const localVertexA: Vector3 = this.collisionReceiver.hitbox.subPlanVertices[i].clone();
            const localVertexB: Vector3 = ((i + 1) === this.collisionReceiver.hitbox.subPlanVertices.length) ?
                this.collisionReceiver.hitbox.subPlanVertices[0].clone() :
                this.collisionReceiver.hitbox.subPlanVertices[i + 1].clone();
            const globalVertexA: Vector3 = localVertexA.applyMatrix4(this.collisionReceiver.meshMatrix);
            const globalVertexB: Vector3 = localVertexB.applyMatrix4(this.collisionReceiver.meshMatrix);
            const possibleDisplacement: Vector3 = this.findDistanceToSegment(this.collisionPoint.clone(), globalVertexA, globalVertexB);
            const distance: number = possibleDisplacement.lengthSq();
            if (distance < smallestDistance) {
                smallestDistance = distance;
                displacement = possibleDisplacement.clone();
            }
        }

        return displacement;
    }

    private findDistanceToSegment(sourcePoint: Vector3, pointA: Vector3, pointB: Vector3): Vector3 {
        const ap: Vector3 = sourcePoint.clone().sub(pointA);
        const ab: Vector3 = pointB.clone().sub(pointA);
        const destinationPoint: Vector3 = pointA.clone().add(ap.clone().projectOnVector(ab));

        return destinationPoint.clone().sub(sourcePoint);
    }

    private findCollisionPoint(firstCar: Car, secondCar: Car): Vector3 {
        let collisionPoint: Vector3 = this.checkIfColliding(firstCar, secondCar);
        if (collisionPoint === undefined) {
            collisionPoint = this.checkIfColliding(secondCar, firstCar);
        }

        return collisionPoint;
    }

    private checkIfColliding(collisionEmitter: Car, collisionReceiver: Car): Vector3 {
        for (const vertex of collisionEmitter.hitbox.subPlanVertices) {
            const localVertex: Vector3 = vertex.clone();
            const globalVertex: Vector3 = localVertex.applyMatrix4(collisionEmitter.meshMatrix);
            const direction: Vector3 = globalVertex.sub(collisionEmitter.currentPosition);
            const ray: Raycaster = new Raycaster(collisionEmitter.currentPosition.clone(), direction.clone().normalize());
            const collisionResult: Intersection[] = ray.intersectObject(collisionReceiver.hitbox);
            if (collisionResult.length > 0 && collisionResult[0].distance < direction.length()) {
                this.collisionEmitter = collisionEmitter;
                this.collisionReceiver = collisionReceiver;

                return collisionEmitter.currentPosition.clone().add(direction);
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
        resultingForces.push(this.findResultingSpeed(movingCarDirection, tangentialForce));
        resultingForces.push(this.findResultingSpeed(motionlessCarDirection, radialForce));

        return resultingForces;
    }

    private findResultingSpeed(carDirection: Vector3, force: Vector3): Vector3 {
        const resultingSpeed: Vector3 = new Vector3(0, 0, 0);
        resultingSpeed.x = this.computeSpeedXComponent(force, carDirection);
        resultingSpeed.z = this.computeSpeedZComponent(force, carDirection);

        return resultingSpeed;
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
        return movingCar.direction.clone().multiplyScalar(-movingCar.speed.z);
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
        firstCar.speed = forces[0].clone().add(forces[3]);
        secondCar.speed = forces[1].clone().add(forces[2]);
    }
}
