import { TrackMesh } from "../track/track";
import { WallPlane } from "../track/plane";
import { Car } from "../car/car";
import { Sphere, Vector3 } from "three";

export class WallCollisionManager {
    private static _track: TrackMesh;

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
                    console.log("prout");
                }
            });
        });
    }

    private static manageCollisionWithExteriorWalls(car: Car): void {
        this._track.exteriorPlanes.forEach((plane: WallPlane) => {
            car.hitbox.boundingSpheres.forEach((sphere: Sphere) => {
                if (this.isSphereIntersectingWallPlane(sphere, plane)) {
                    console.log("prout");
                }
            });
        });
    }

    private static isSphereIntersectingWallPlane(sphere: Sphere, plane: WallPlane): boolean {
        if (!sphere.intersectsPlane(plane)) {
            return false;
        }

        return plane.isPointBetweenWallLimits(plane.projectPoint(sphere.center.clone()));
    }
}
