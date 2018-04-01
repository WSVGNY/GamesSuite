import { Car } from "../car/car";
import { Vector3, Intersection, Raycaster } from "three";
import { MINIMUM_CAR_DISTANCE } from "../constants";

const EMITTER_SPEED_AFTER_COLLISION: number = 0;
const RECEIVER_SPEED_AFTER_COLLISION: number = 1;

export class CarCollisionManager {
    private static _collisionEmitter: Car;
    private static _collisionReceiver: Car;
    private static _collisionPoint: Vector3;

    public static update(cars: Car[]): boolean {
        let playSound: boolean;
        for (let firstCarIndex: number = 0; firstCarIndex < cars.length; ++firstCarIndex) {
            for (let secondCarIndex: number = firstCarIndex + 1; secondCarIndex < cars.length; ++secondCarIndex) {
                if (this.checkIfCarsAreClose(cars[firstCarIndex], cars[secondCarIndex])) {
                    playSound = this.applyCollisionDetection(cars, firstCarIndex, secondCarIndex);
                }
            }
        }

        return playSound;
    }

    private static checkIfCarsAreClose(firstCar: Car, secondCar: Car): boolean {
        return (firstCar.currentPosition.distanceTo(secondCar.currentPosition) < MINIMUM_CAR_DISTANCE) ? true : false;
    }

    private static applyCollisionDetection(cars: Car[], firstCarIndex: number, secondCarIndex: number): boolean {
        this._collisionPoint = this.findCollisionPoint(cars[firstCarIndex], cars[secondCarIndex]);
        if (this._collisionPoint !== undefined) {
            this._collisionPoint.y = 0;
            this.resolveHitboxOverlap();
            if (!this._collisionEmitter.hitbox.inCollision && !this._collisionReceiver.hitbox.inCollision) {
                this.applyCollisionPhysics();

                return true;
            }
        } else {
            cars[firstCarIndex].hitbox.inCollision = false;
            cars[secondCarIndex].hitbox.inCollision = false;
        }

        return false;
    }

    private static applyCollisionPhysics(): void {
        this._collisionEmitter.hitbox.inCollision = true;
        this._collisionReceiver.hitbox.inCollision = true;
        const forces1: Vector3[] = this.computeResultingForces(
            this._collisionEmitter,
            this._collisionReceiver,
            this._collisionPoint.clone()
        );
        const forces2: Vector3[] = this.computeResultingForces(
            this._collisionReceiver,
            this._collisionEmitter,
            this._collisionPoint.clone()
        );
        this.applyForces(forces1, forces2);
    }

    private static resolveHitboxOverlap(): void {
        const displacement: Vector3 = this.findDisplacementVector();
        displacement.y = 0;
        this._collisionEmitter.setCurrentPosition(
            this._collisionEmitter.currentPosition.clone()
                .add(displacement.clone()
                    .multiplyScalar(2)
                ));
    }

    private static findDisplacementVector(): Vector3 {
        let smallestDistance: number = 2e19;
        let displacement: Vector3;
        for (let i: number = 0; i < this._collisionReceiver.hitbox.bottomPlaneVertices.length; ++i) {
            const desiredGlobalVertices: Vector3[] = this.computeIntersectingHitboxSide(i);
            const possibleDisplacement: Vector3 =
                this.findDistanceToSegment(
                    this._collisionPoint.clone(),
                    desiredGlobalVertices[0],
                    desiredGlobalVertices[1]
                );
            const distance: number = possibleDisplacement.lengthSq();
            if (distance < smallestDistance) {
                smallestDistance = distance;
                displacement = possibleDisplacement.clone();
            }
        }

        return displacement;
    }

    private static computeIntersectingHitboxSide(index: number): Vector3[] {
        const localVertexA: Vector3 = this._collisionReceiver.hitbox.bottomPlaneVertices[index].clone();
        const localVertexB: Vector3 = ((index + 1) === this._collisionReceiver.hitbox.bottomPlaneVertices.length) ?
            this._collisionReceiver.hitbox.bottomPlaneVertices[0].clone() :
            this._collisionReceiver.hitbox.bottomPlaneVertices[index + 1].clone();
        const globalVertices: Vector3[] = [];
        globalVertices.push(localVertexA.applyMatrix4(this._collisionReceiver.meshMatrix));
        globalVertices.push(localVertexB.applyMatrix4(this._collisionReceiver.meshMatrix));

        return globalVertices;
    }

    private static findDistanceToSegment(sourcePoint: Vector3, pointA: Vector3, pointB: Vector3): Vector3 {
        const ap: Vector3 = sourcePoint.clone().sub(pointA);
        const ab: Vector3 = pointB.clone().sub(pointA);
        const destinationPoint: Vector3 = pointA.clone().add(ap.clone().projectOnVector(ab));

        return destinationPoint.clone().sub(sourcePoint);
    }

    private static findCollisionPoint(firstCar: Car, secondCar: Car): Vector3 {
        let collisionPoint: Vector3 = this.checkIfColliding(firstCar, secondCar);
        if (collisionPoint === undefined) {
            collisionPoint = this.checkIfColliding(secondCar, firstCar);
        }

        return collisionPoint;
    }

    private static checkIfColliding(collisionEmitter: Car, collisionReceiver: Car): Vector3 {
        for (const vertex of collisionEmitter.hitbox.bottomPlaneVertices) {

            const localVertex: Vector3 = vertex.clone();
            const globalVertex: Vector3 = localVertex.applyMatrix4(collisionEmitter.meshMatrix);
            const direction: Vector3 = globalVertex.sub(collisionEmitter.currentPosition);
            const ray: Raycaster = new Raycaster(collisionEmitter.currentPosition.clone(), direction.clone().normalize());

            if (this.areCarsColliding(ray.intersectObject(collisionReceiver.hitbox), direction)) {
                this._collisionEmitter = collisionEmitter;
                this._collisionReceiver = collisionReceiver;

                return collisionEmitter.currentPosition.clone().add(direction);
            }
        }

        return undefined;
    }

    private static areCarsColliding(collisionResult: Intersection[], direction: Vector3): boolean {
        return collisionResult.length > 0 && collisionResult[0].distance < direction.length();
    }

    private static computeResultingForces(movingCar: Car, motionlessCar: Car, collisionPoint: Vector3): Vector3[] {
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

    private static findResultingSpeed(carDirection: Vector3, force: Vector3): Vector3 {
        const resultingSpeed: Vector3 = new Vector3(0, 0, 0);
        resultingSpeed.x = this.computeSpeedXComponent(force, carDirection);
        resultingSpeed.z = this.computeSpeedZComponent(force, carDirection);

        return resultingSpeed;
    }

    private static computeSpeedXComponent(force: Vector3, carDirection: Vector3): number {
        const sign: number = (force.clone().cross(carDirection).y < 0) ? -1 : 1;

        return force.clone().projectOnVector(this.orthogonalVector(carDirection)).length() * sign;
    }

    private static computeSpeedZComponent(force: Vector3, carDirection: Vector3): number {
        const sign: number = (force.clone().dot(carDirection) > 0) ? -1 : 1;

        return force.clone().projectOnVector(carDirection).length() * sign;
    }

    private static getCarSpeed(movingCar: Car): Vector3 {
        return movingCar.direction.clone().multiplyScalar(-movingCar.speed.z);
    }

    private static getTangentialForce(movingCarSpeed: Vector3, collisionAxis: Vector3): Vector3 {
        return movingCarSpeed.clone().projectOnVector(collisionAxis);
    }

    private static getRadialForce(movingCarSpeed: Vector3, collisionAxis: Vector3): Vector3 {
        return movingCarSpeed.clone().projectOnVector(this.orthogonalVector(collisionAxis));
    }

    private static orthogonalVector(vector: Vector3): Vector3 {
        return new Vector3(vector.z, 0, - vector.x);
    }

    private static applyForces(forces1: Vector3[], forces2: Vector3[]): void {
        this._collisionEmitter.speed = forces1[EMITTER_SPEED_AFTER_COLLISION].clone().add(forces2[EMITTER_SPEED_AFTER_COLLISION]);
        this._collisionReceiver.speed = forces1[RECEIVER_SPEED_AFTER_COLLISION].clone().add(forces2[RECEIVER_SPEED_AFTER_COLLISION]);
    }
    private static computeCollisionAxis(firstCar: Car, secondCar: Car, collisionPoint: Vector3): Vector3 {
        const collisionToFirstCar: Vector3 = firstCar.currentPosition.clone().sub(collisionPoint);
        const collisionToSecondCar: Vector3 = secondCar.currentPosition.clone().sub(collisionPoint);

        collisionToFirstCar.y = 0;
        collisionToSecondCar.y = 0;

        const halfOfSmallAngle: number = this.computeHalfOfSmallAngle(collisionToFirstCar, collisionToSecondCar);

        const collisionAxis: Vector3 = collisionToFirstCar.clone().normalize().applyAxisAngle(new Vector3(0, 1, 0), halfOfSmallAngle);
        collisionAxis.y = 0;

        return collisionAxis;
    }

    private static computeHalfOfSmallAngle(collisionToFirstCar: Vector3, collisionToSecondCar: Vector3): number {
        let halfOfSmallAngle: number = collisionToFirstCar.angleTo(collisionToSecondCar) / 2;
        if (collisionToFirstCar.clone().cross(collisionToSecondCar).y < 0) {
            halfOfSmallAngle = -halfOfSmallAngle;
        }

        return halfOfSmallAngle;
    }

}
