import { TrackMesh } from "../track/track";
import { WallPlane } from "../track/plane";
import { AbstractCar } from "../car/abstractCar";
import { Sphere, Vector3 } from "three";
import { POS_Y_AXIS, NEG_Y_AXIS } from "../constants/global.constants";
import { PI_OVER_2 } from "../constants/math.constants";
import { AICar } from "../car/aiCar";
import { Injectable } from "@angular/core";
import { SLOW_DOWN_FACTOR, ROTATION_FACTOR } from "../constants/track.constants";
import { SoundService } from "../sound-service/sound.service";

@Injectable()
export class WallCollisionService {
    private _track: TrackMesh;
    private _projectedPointOnPlane: Vector3;

    public initialize(track: TrackMesh): void {
        this._track = track;
    }

    public update(cars: AbstractCar[], soundManager: SoundService): void {
        cars.forEach((car: AbstractCar) => {
            this._track.interiorPlanes.forEach((plane: WallPlane) => {
                this.manageCollisionWithWall(car, plane, true, soundManager);
            });
            this._track.exteriorPlanes.forEach((plane: WallPlane) => {
                this.manageCollisionWithWall(car, plane, false, soundManager);
            });
        });
    }

    private manageCollisionWithWall(
        car: AbstractCar, plane: WallPlane, isInteriorWall: boolean,
        soundManager: SoundService): void {
        car.hitbox.boundingSpheres.forEach((sphere: Sphere) => {
            if (this.isSphereIntersectingWallPlane(sphere, plane)) {
                this.moveCarAwayFromWall(car, sphere, plane, isInteriorWall);
                this.rotateCar(car, plane, isInteriorWall);
                car.speed = car.speed.multiplyScalar(SLOW_DOWN_FACTOR);
                if (!(car instanceof AICar)) {
                    soundManager.playWallCollision();
                }
            }
        });
    }

    private moveCarAwayFromWall(car: AbstractCar, sphere: Sphere, plane: WallPlane, isInteriorWall: boolean): void {
        const vectorFromCenterToWall: Vector3 = this._projectedPointOnPlane.clone().sub(sphere.center);

        const unitVectorFromCenterToWall: Vector3 = this.sphereIsOtherSideOfWall(vectorFromCenterToWall, plane, isInteriorWall) ?
            vectorFromCenterToWall.clone().normalize().negate() :
            vectorFromCenterToWall.clone().normalize();

        const vectorFromPointOnSphereToCenter: Vector3 = unitVectorFromCenterToWall.clone()
            .multiplyScalar(sphere.radius)
            .negate();
        const overlapCorrection: Vector3 = vectorFromPointOnSphereToCenter.add(vectorFromCenterToWall);

        car.setCurrentPosition(car.currentPosition.clone().add(overlapCorrection));
    }

    private rotateCar(car: AbstractCar, plane: WallPlane, isInteriorWall: boolean): void {
        const angleBetweenWallAndCar: number = car.direction.clone().angleTo(plane.directorVector);
        car.rotateMesh(
            isInteriorWall === angleBetweenWallAndCar < PI_OVER_2 ? POS_Y_AXIS : NEG_Y_AXIS,
            this.calculateRotationAngle(car, angleBetweenWallAndCar)
        );
    }

    private calculateRotationAngle(car: AbstractCar, angleBetweenWallAndCar: number): number {
        return (car.speed.length() * ROTATION_FACTOR) * (Math.cos(angleBetweenWallAndCar * 2) + 1);
    }

    private sphereIsOtherSideOfWall(vectorFromCenterToWall: Vector3, plane: WallPlane, isInteriorWall: boolean): boolean {
        if (isInteriorWall) {
            return vectorFromCenterToWall.clone().cross(plane.directorVector).y < 0;
        } else {
            return vectorFromCenterToWall.clone().cross(plane.directorVector).y > 0;
        }
    }

    private isSphereIntersectingWallPlane(sphere: Sphere, plane: WallPlane): boolean {
        if (!sphere.intersectsPlane(plane)) {
            return false;
        }
        this._projectedPointOnPlane = plane.projectPoint(sphere.center.clone());

        return plane.isPointBetweenWallLimits(this._projectedPointOnPlane);
    }
}
