import { TrackMesh } from "../track/track";
import { WallPlane } from "../track/plane";
import { Car } from "../car/car";
import { Sphere, Vector3 } from "three";
import { SoundManagerService } from "../sound-service/sound-manager.service";

export class WallCollisionManager {
    private static _track: TrackMesh;
    private static _projectedPointOnPlane: Vector3;

    public static set track(track: TrackMesh) {
        this._track = track;
    }

    public static update(cars: Car[], soundManager: SoundManagerService): void {
        cars.forEach((car: Car) => {
            this._track.interiorPlanes.forEach((plane: WallPlane) => {
                this.manageCollisionWithWall(car, plane, true, soundManager);
            });
            this._track.exteriorPlanes.forEach((plane: WallPlane) => {
                this.manageCollisionWithWall(car, plane, false, soundManager);
            });
        });
    }

    private static manageCollisionWithWall(car: Car, plane: WallPlane, isInteriorWall: boolean, soundManager: SoundManagerService): void {
        car.hitbox.boundingSpheres.forEach((sphere: Sphere) => {
            if (this.isSphereIntersectingWallPlane(sphere, plane)) {
                this.moveCarAwayFromWall(car, sphere, plane, isInteriorWall);
                car.speed = car.speed.multiplyScalar(0.985);
                if (!car.isAI) {
                    soundManager.playWallCollision();
                }
            }
        });
    }

    private static moveCarAwayFromWall(car: Car, sphere: Sphere, plane: WallPlane, isInteriorWall: boolean): void {
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

    private static sphereIsOtherSideOfWall(vectorFromCenterToWall: Vector3, plane: WallPlane, isInteriorWall: boolean): boolean {
        if (isInteriorWall) {
            return vectorFromCenterToWall.clone().cross(plane.directorVector).y < 0;
        } else {
            return vectorFromCenterToWall.clone().cross(plane.directorVector).y > 0;
        }
    }

    private static isSphereIntersectingWallPlane(sphere: Sphere, plane: WallPlane): boolean {
        if (!sphere.intersectsPlane(plane)) {
            return false;
        }
        this._projectedPointOnPlane = plane.projectPoint(sphere.center.clone());

        return plane.isPointBetweenWallLimits(this._projectedPointOnPlane);
    }
}
