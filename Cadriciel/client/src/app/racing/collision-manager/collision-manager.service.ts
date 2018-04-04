import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { Vector3 } from "three";
import { MINIMUM_CAR_DISTANCE } from "../constants";

@Injectable()
export class CollisionManagerService {

    public shouldPlaySound: boolean;

    private _collisionCarA: Car;
    private _collisionCarB: Car;
    private _collisionPoint: Vector3;
    private _overlapCorrection: Vector3;

    public constructor() {
        this.shouldPlaySound = false;
    }

    public update(cars: Car[]): void {
        for (let firstCarIndex: number = 0; firstCarIndex < cars.length; ++firstCarIndex) {
            for (let secondCarIndex: number = firstCarIndex + 1; secondCarIndex < cars.length; ++secondCarIndex) {
                if (this.checkIfCarsAreClose(cars[firstCarIndex], cars[secondCarIndex])) {
                    this.applyCollisionDetection(cars[firstCarIndex], cars[secondCarIndex]);
                }
            }
        }
    }

    private applyCollisionDetection(firstCar: Car, secondCar: Car): void {
        if (this.computeCollisionParameters(firstCar, secondCar)) {
            this.resolveHitboxOverlap();
            if (this.checkIfCarsInCollision()) {
                this.applyCollisionPhysics();
            }
        } else {
            firstCar.hitbox.inCollision = false;
            secondCar.hitbox.inCollision = false;
            this.shouldPlaySound = false;
        }
    }

    private applyCollisionPhysics(): void {
        this._collisionCarA.hitbox.inCollision = true;
        this._collisionCarB.hitbox.inCollision = true;
        this.shouldPlaySound = true;
        this.computeResultingForces(
            this._collisionCarA,
            this._collisionCarB,
            this._collisionPoint.clone()
        );
    }

    private checkIfCarsInCollision(): boolean {
        return (!this._collisionCarA.hitbox.inCollision) && (!this._collisionCarB.hitbox.inCollision);
    }

    public get inCollision(): boolean {
        return this.shouldPlaySound;
    }

    private resolveHitboxOverlap(): void {
        this._collisionCarA.setCurrentPosition(
            this._collisionCarA.currentPosition.clone()
            .add(this._overlapCorrection.clone().multiplyScalar(0.51))
        );
        this._collisionCarB.setCurrentPosition(
            this._collisionCarB.currentPosition.clone()
            .add(this._overlapCorrection.clone().negate().multiplyScalar(0.51))
        );
    }

    private checkIfCarsAreClose(firstCar: Car, secondCar: Car): boolean {
        return (firstCar.currentPosition.distanceTo(secondCar.currentPosition) < MINIMUM_CAR_DISTANCE) ? true : false;
    }

    private computeCollisionParameters(firstCar: Car, secondCar: Car): boolean {
        this._overlapCorrection = new Vector3();
        let collisionDetected: boolean = false;
        for (const firstCarSphere of firstCar.hitbox.boundingSpheres) {
            for (const secondCarSphere of secondCar.hitbox.boundingSpheres) {
                if (firstCarSphere.intersectsSphere(secondCarSphere)) {
                    const closestFirstSphereVertex: Vector3 = firstCarSphere.clampPoint(secondCarSphere.center);
                    const closestSecondSphereVertex: Vector3 = secondCarSphere.clampPoint(firstCarSphere.center);
                    const firstToSecondVertex: Vector3 = closestSecondSphereVertex.clone().sub(closestFirstSphereVertex);
                    if (!collisionDetected) {
                        this.setCollisionPoint(closestFirstSphereVertex.clone().add(firstToSecondVertex.clone().multiplyScalar(0.5)));
                        this.setCollisionCars(firstCar, secondCar);
                    }
                    this._overlapCorrection.add(closestSecondSphereVertex.clone().sub(closestFirstSphereVertex));
                    collisionDetected = true;
                }
            }
        }

        return collisionDetected;
    }

    private setCollisionPoint(collisionPoint: Vector3): void {
        this._collisionPoint = collisionPoint;
        this._collisionPoint.y = 0;
    }

    private setCollisionCars(firstCar: Car, secondCar: Car): void {
        this._collisionCarA = firstCar;
        this._collisionCarB = secondCar;
    }

    private computeResultingForces(movingCar: Car, motionlessCar: Car, collisionPoint: Vector3): void {
        const speedCarA: Vector3 = this.getCarSpeed(movingCar);
        const speedCarB: Vector3 = this.getCarSpeed(motionlessCar);
        const positionCarA: Vector3 = movingCar.currentPosition.clone();
        const positionCarB: Vector3 = motionlessCar.currentPosition.clone();

        const newSpeedCarA: Vector3 = speedCarA.clone().sub(
            (positionCarA.clone().sub(positionCarB)).multiplyScalar(
                ((speedCarA.clone().sub(speedCarB)).dot(positionCarA.clone().sub(positionCarB))) /
                ((positionCarA.clone().sub(positionCarB)).lengthSq()))
            );

        const newSpeedCarB: Vector3 = speedCarB.clone().sub(
            (positionCarB.clone().sub(positionCarA)).multiplyScalar(
                ((speedCarB.clone().sub(speedCarA)).dot(positionCarB.clone().sub(positionCarA))) /
                ((positionCarB.clone().sub(positionCarA)).lengthSq()))
            );

        this._collisionCarA.speed = this.findResultingSpeed(movingCar.direction.clone(), newSpeedCarA);
        this._collisionCarB.speed = this.findResultingSpeed(motionlessCar.direction.clone(), newSpeedCarB);
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
        const speed: Vector3 = new Vector3();
        speed.add(movingCar.direction.clone().normalize().multiplyScalar(Math.abs(movingCar.speed.z)));
        speed.add(this.orthogonalVector(movingCar.direction.clone().normalize()).multiplyScalar(Math.abs(movingCar.speed.x)));

        return speed;
    }

    private orthogonalVector(vector: Vector3): Vector3 {
        return new Vector3(vector.z, 0, - vector.x);
    }
}
