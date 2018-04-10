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
        });
    }

    private static manageCollisionWithInteriorWalls(car: Car): void {
        this._track.interiorPlanes.forEach((plane: WallPlane) => {
            // car.hitbox.boundingSpheres.forEach((sphere: Sphere) => {
            if (this.isSphereIntersectingWallPlane(car.hitbox.boundingSpheres[0], plane)) {
                console.log("prout");
            }
            // });
        });
    }

    private static isSphereIntersectingWallPlane(sphere: Sphere, plane: WallPlane): boolean {
        if (!sphere.intersectsPlane(plane)) {
            return false;
        } else {
            console.log("allo");
        }

        const projectedPoint: Vector3 = new Vector3();
        plane.projectPoint(sphere.center, projectedPoint);

        return plane.isPointBetweenWallLimits(projectedPoint);
    }
}
