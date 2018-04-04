import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { Vector3, Scene } from "three";
import { MINIMUM_CAR_DISTANCE } from "../constants";
import { VectorHelper } from "../artificial-intelligence/vectorHelper";

const EMITTER_SPEED_AFTER_COLLISION: number = 0;
const RECEIVER_SPEED_AFTER_COLLISION: number = 1;

@Injectable()
export class CollisionManagerService {

    private helper1: VectorHelper;
    private helper2: VectorHelper;
    private pointHelper: VectorHelper;

    private scene: Scene;
    public shouldPlaySound: boolean;

    private _collisionCarA: Car;
    private _collisionCarB: Car;
    private _collisionPoint: Vector3;
    private _overlapCorrection: Vector3;

    public constructor() {
        this.shouldPlaySound = false;
        this.helper1 = new VectorHelper(0xFFFFFF);
        this.helper2 = new VectorHelper(0x00FF00);
        this.pointHelper = new VectorHelper(0xFF0000);
    }

    public update(cars: Car[], scene: Scene): void {
        this.scene = scene;
        for (let firstCarIndex: number = 0; firstCarIndex < cars.length; ++firstCarIndex) {
            for (let secondCarIndex: number = firstCarIndex + 1; secondCarIndex < cars.length; ++secondCarIndex) {
                // console.log(cars[firstCarIndex].currentPosition);

                if (this.checkIfCarsAreClose(cars[firstCarIndex], cars[secondCarIndex])) {
                    this.applyCollisionDetection(cars[firstCarIndex], cars[secondCarIndex]);
                }
            }
        }
    }

    private applyCollisionDetection(firstCar: Car, secondCar: Car): void {
        if (this.computeCollisionParameters(firstCar, secondCar)) {
            // this.resolveHitboxOverlap();
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
        const forces1: Vector3[] = this.computeResultingForces(
            this._collisionCarA,
            this._collisionCarB,
            this._collisionPoint.clone()
        );
        const forces2: Vector3[] = this.computeResultingForces(
            this._collisionCarB,
            this._collisionCarA,
            this._collisionPoint.clone()
        );
        this.applyForces(forces1, forces2);
    }

    private checkIfCarsInCollision(): boolean {
        return (!this._collisionCarA.hitbox.inCollision) && (!this._collisionCarB.hitbox.inCollision);
    }

    public get inCollision(): boolean {
        return this.shouldPlaySound;
    }

    // private resolveHitboxOverlap(): void {
    //     this._collisionCarA.setCurrentPosition(
    //         this._collisionCarA.currentPosition.clone()
    //         .add(this._overlapCorrection.clone().multiplyScalar(0.51))
    //     );
    //     this._collisionCarB.setCurrentPosition(
    //         this._collisionCarB.currentPosition.clone()
    //         .add(this._overlapCorrection.clone().negate().multiplyScalar(0.51))
    //     );
    // }

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

    private computeCollisionAxis(firstCar: Car, secondCar: Car, collisionPoint: Vector3): Vector3 {
        const collisionToFirstCar: Vector3 = firstCar.currentPosition.clone().sub(collisionPoint);
        const collisionToSecondCar: Vector3 = secondCar.currentPosition.clone().sub(collisionPoint);

        collisionToFirstCar.y = 0;
        collisionToSecondCar.y = 0;

        const halfOfSmallAngle: number = this.computeHalfOfSmallAngle(collisionToFirstCar, collisionToSecondCar);

        const collisionAxis: Vector3 = collisionToFirstCar.clone().normalize().applyAxisAngle(new Vector3(0, 1, 0), halfOfSmallAngle);
        collisionAxis.y = 0;

        return collisionAxis;
    }

    private computeHalfOfSmallAngle(collisionToFirstCar: Vector3, collisionToSecondCar: Vector3): number {
        let halfOfSmallAngle: number = collisionToFirstCar.angleTo(collisionToSecondCar) / 2;
        if (collisionToFirstCar.clone().cross(collisionToSecondCar).y < 0) {
            halfOfSmallAngle = -halfOfSmallAngle;
        }

        return halfOfSmallAngle;
    }

    private computeResultingForces(movingCar: Car, motionlessCar: Car, collisionPoint: Vector3): Vector3[] {
        const movingCarSpeed: Vector3 = this.getCarSpeed(movingCar);
        const collisionAxis: Vector3 = this.computeCollisionAxis(movingCar, motionlessCar, collisionPoint);
        this.scene.remove(this.helper2);
        this.helper2.update(collisionPoint, collisionPoint.clone().add(collisionAxis.clone().multiplyScalar(5)));
        this.scene.add(this.helper2);
        const radialForce: Vector3 = this.getRadialForce(movingCarSpeed, collisionAxis);
        const tangentialForce: Vector3 = this.getTangentialForce(movingCarSpeed, collisionAxis);
        const movingCarDirection: Vector3 = movingCar.direction.clone();
        const motionlessCarDirection: Vector3 = motionlessCar.direction.clone();
        const resultingForces: Vector3[] = [];

        resultingForces.push(this.findResultingSpeed(movingCarDirection, tangentialForce));
        if (radialForce.clone().dot(collisionPoint.clone().sub(motionlessCar.currentPosition)) < 0) {
            resultingForces.push(this.findResultingSpeed(motionlessCarDirection, radialForce));

        }

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
        console.log(sign);
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

    private getTangentialForce(movingCarSpeed: Vector3, collisionAxis: Vector3): Vector3 {
        return movingCarSpeed.clone().projectOnVector(collisionAxis);
    }

    private getRadialForce(movingCarSpeed: Vector3, collisionAxis: Vector3): Vector3 {
        return movingCarSpeed.clone().projectOnVector(this.orthogonalVector(collisionAxis));
    }

    private orthogonalVector(vector: Vector3): Vector3 {
        return new Vector3(vector.z, 0, - vector.x);
    }

    private applyForces(forces1: Vector3[], forces2: Vector3[]): void {
        this._collisionCarA.speed = forces1[EMITTER_SPEED_AFTER_COLLISION].clone().add(forces2[EMITTER_SPEED_AFTER_COLLISION]);
        this._collisionCarB.speed = forces1[RECEIVER_SPEED_AFTER_COLLISION].clone().add(forces2[RECEIVER_SPEED_AFTER_COLLISION]);
    }
}
