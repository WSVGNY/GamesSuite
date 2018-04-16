import { AbstractCar } from "../car/abstractCar";
import { Vector3 } from "three";
import { SoundManagerService } from "../sound-service/sound-manager.service";
import { MINIMUM_CAR_DISTANCE } from "../constants/car.constants";
import { OVERLAP_CORRECTION_SCALAR, HALF } from "../constants/math.constants";
import { AICar } from "../car/aiCar";

export class CarCollisionManager {

    private static _collisionCarA: AbstractCar;
    private static _collisionCarB: AbstractCar;
    private static _collisionPoint: Vector3;
    private static _overlapCorrection: Vector3;

    public static update(cars: AbstractCar[], soundManager: SoundManagerService): void {
        for (let firstCarIndex: number = 0; firstCarIndex < cars.length; ++firstCarIndex) {
            for (let secondCarIndex: number = firstCarIndex + 1; secondCarIndex < cars.length; ++secondCarIndex) {
                if (this.checkIfCarsAreClose(cars[firstCarIndex], cars[secondCarIndex])) {
                    this.applyCollisionDetection(cars[firstCarIndex], cars[secondCarIndex], soundManager);
                }
            }
        }
    }

    private static applyCollisionDetection(firstCar: AbstractCar, secondCar: AbstractCar, soundManager: SoundManagerService): void {
        if (this.computeCollisionParameters(firstCar, secondCar)) {
            this.resolveHitboxOverlap();
            if (!this.carsInCollision()) {
                this.applyCollisionPhysics();
                if (!(firstCar instanceof AICar) || !(secondCar instanceof AICar)) {
                    soundManager.playCarCollision();
                }
            }
        } else {
            firstCar.hitbox.inCollision = false;
            secondCar.hitbox.inCollision = false;
        }
    }

    private static applyCollisionPhysics(): void {
        this._collisionCarA.hitbox.inCollision = true;
        this._collisionCarB.hitbox.inCollision = true;
        this.computeResultingForces(
            this._collisionCarA,
            this._collisionCarB,
            this._collisionPoint.clone()
        );
    }

    private static carsInCollision(): boolean {
        return this._collisionCarA.hitbox.inCollision || this._collisionCarB.hitbox.inCollision;
    }

    private static resolveHitboxOverlap(): void {
        this._collisionCarA.setCurrentPosition(
            this._collisionCarA.currentPosition.clone()
                .add(this._overlapCorrection.clone().multiplyScalar(OVERLAP_CORRECTION_SCALAR))
        );
        this._collisionCarB.setCurrentPosition(
            this._collisionCarB.currentPosition.clone()
                .add(this._overlapCorrection.clone().negate().multiplyScalar(OVERLAP_CORRECTION_SCALAR))
        );
    }

    private static checkIfCarsAreClose(firstCar: AbstractCar, secondCar: AbstractCar): boolean {
        return (firstCar.currentPosition.distanceTo(secondCar.currentPosition) < MINIMUM_CAR_DISTANCE) ? true : false;
    }

    private static computeCollisionParameters(firstCar: AbstractCar, secondCar: AbstractCar): boolean {
        this._overlapCorrection = new Vector3();
        let collisionDetected: boolean = false;
        for (const firstCarSphere of firstCar.hitbox.boundingSpheres) {
            for (const secondCarSphere of secondCar.hitbox.boundingSpheres) {
                if (firstCarSphere.intersectsSphere(secondCarSphere)) {
                    const closestFirstSphereVertex: Vector3 = firstCarSphere.clampPoint(secondCarSphere.center);
                    const closestSecondSphereVertex: Vector3 = secondCarSphere.clampPoint(firstCarSphere.center);
                    const firstToSecondVertex: Vector3 = closestSecondSphereVertex.clone().sub(closestFirstSphereVertex);
                    if (!collisionDetected) {
                        this.setCollisionPoint(closestFirstSphereVertex.clone().add(firstToSecondVertex.clone().multiplyScalar(HALF)));
                        this.setCollisionCars(firstCar, secondCar);
                    }
                    this._overlapCorrection.add(closestSecondSphereVertex.clone().sub(closestFirstSphereVertex));
                    collisionDetected = true;
                }
            }
        }

        return collisionDetected;
    }

    private static setCollisionPoint(collisionPoint: Vector3): void {
        this._collisionPoint = collisionPoint;
        this._collisionPoint.y = 0;
    }

    private static setCollisionCars(firstCar: AbstractCar, secondCar: AbstractCar): void {
        this._collisionCarA = firstCar;
        this._collisionCarB = secondCar;
    }

    private static computeResultingForces(movingCar: AbstractCar, motionlessCar: AbstractCar, collisionPoint: Vector3): void {
        const speedCarA: Vector3 = this.getCarSpeed(movingCar);
        const speedCarB: Vector3 = this.getCarSpeed(motionlessCar);
        const positionCarA: Vector3 = movingCar.currentPosition.clone();
        const positionCarB: Vector3 = motionlessCar.currentPosition.clone();

        const newSpeedCarA: Vector3 = this.createNewSpeedCar(speedCarA, speedCarB, positionCarA, positionCarB);

        const newSpeedCarB: Vector3 = this.createNewSpeedCar(speedCarB, speedCarA, positionCarB, positionCarA);

        this._collisionCarA.speed = this.findResultingSpeed(movingCar.direction.clone(), newSpeedCarA);
        this._collisionCarB.speed = this.findResultingSpeed(motionlessCar.direction.clone(), newSpeedCarB);
    }

    private static createNewSpeedCar(speedCar1: Vector3, speedCar2: Vector3, positionCar1: Vector3, positionCar2: Vector3): Vector3 {
        return speedCar1.clone().sub(
            (positionCar1.clone().sub(positionCar2)).multiplyScalar(
                ((speedCar1.clone().sub(speedCar2)).dot(positionCar1.clone().sub(positionCar2))) /
                ((positionCar1.clone().sub(positionCar2)).lengthSq()))
        );
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

    private static getCarSpeed(movingCar: AbstractCar): Vector3 {
        const speed: Vector3 = new Vector3();
        speed.add(movingCar.direction.clone().normalize().multiplyScalar(Math.abs(movingCar.speed.z)));
        speed.add(this.orthogonalVector(movingCar.direction.clone().normalize()).multiplyScalar(Math.abs(movingCar.speed.x)));

        return speed;
    }

    private static orthogonalVector(vector: Vector3): Vector3 {
        return new Vector3(vector.z, 0, - vector.x);
    }
}
