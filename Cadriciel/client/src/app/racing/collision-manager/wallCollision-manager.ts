import { TrackMesh } from "../track/track";
import { WallPlane } from "../track/plane";
import { Car } from "../car/car";
import { Sphere, Vector3 } from "three";

export class WallCollisionManager {
    private static _track: TrackMesh;
    private static projectedPointOnPlane: Vector3;

    public static set track(track: TrackMesh) {
        this._track = track;
    }

    public static update(cars: Car[]): void {
        cars.forEach((car: Car) => {
            this.manageCollisionWithInteriorWalls(car);
            this.manageCollisionWithExteriorWalls(car);
        });
    }

    private static manageCollisionWithInteriorWalls(car: Car): void {
        this._track.interiorPlanes.forEach((plane: WallPlane) => {
            car.hitbox.boundingSpheres.forEach((sphere: Sphere) => {
                if (this.isSphereIntersectingWallPlane(sphere, plane)) {
                    this.moveCarAwayFromWall(car, sphere, plane, true);
                    car.speed = car.speed.multiplyScalar(0.985);
                }
            });
        });
    }

    private static manageCollisionWithExteriorWalls(car: Car): void {
        this._track.exteriorPlanes.forEach((plane: WallPlane) => {
            car.hitbox.boundingSpheres.forEach((sphere: Sphere) => {
                if (this.isSphereIntersectingWallPlane(sphere, plane)) {
                    this.moveCarAwayFromWall(car, sphere, plane, false);
                    car.speed = car.speed.multiplyScalar(0.985);
                }
            });
        });
    }

    private static moveCarAwayFromWall(car: Car, sphere: Sphere, plane: WallPlane, isInteriorWall: boolean): void {
        const vectorFromCenterToWall: Vector3 = this.projectedPointOnPlane.clone().sub(sphere.center);

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
        this.projectedPointOnPlane = plane.projectPoint(sphere.center.clone());

        return plane.isPointBetweenWallLimits(this.projectedPointOnPlane);
    }
}
