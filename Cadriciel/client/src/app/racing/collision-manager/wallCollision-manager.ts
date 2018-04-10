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
                    // car.steerLeft();
                    car.speed = car.speed.multiplyScalar(0.99);
                }
            });
        });
    }

    private static manageCollisionWithExteriorWalls(car: Car): void {
        this._track.exteriorPlanes.forEach((plane: WallPlane) => {
            car.hitbox.boundingSpheres.forEach((sphere: Sphere) => {
                if (this.isSphereIntersectingWallPlane(sphere, plane)) {
                    this.moveCarAwayFromWall(car, sphere, plane, false);
                    // car.steerRight();
                    car.speed = car.speed.multiplyScalar(0.99);
                    // this.applyResultingForceOnCar(car, plane);
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

    // private static applyResultingForceOnCar(car: Car, plane: WallPlane): void {
    //     const resultingForce: Vector3 = this.calculateResultingForce(car, plane);
    //     car.speed = this.findResultingSpeed(car.direction.clone(), resultingForce);
    // }

    // private static findResultingSpeed(carDirection: Vector3, force: Vector3): Vector3 {
    //     const resultingSpeed: Vector3 = new Vector3(0, 0, 0);
    //     resultingSpeed.x += this.computeSpeedXComponent(force, carDirection);
    //     resultingSpeed.z += this.computeSpeedZComponent(force, carDirection);

    //     return resultingSpeed;
    // }

    // private static computeSpeedXComponent(force: Vector3, carDirection: Vector3): number {
    //     const sign: number = (force.clone().cross(carDirection).y < 0) ? -1 : 1;

    //     return force.clone().projectOnVector(this.findOrthogonalVector(carDirection)).length() * sign;
    // }

    // private static computeSpeedZComponent(force: Vector3, carDirection: Vector3): number {
    //     const sign: number = (force.clone().dot(carDirection) > 0) ? -1 : 1;

    //     return force.clone().projectOnVector(carDirection).length() * sign;
    // }

    // private static calculateResultingForce(car: Car, plane: WallPlane): Vector3 {
    //     const vectorFromCarToWall: Vector3 = plane.projectPoint(car.currentPosition).sub(car.currentPosition);

    //     return car.speed.clone().projectOnVector(this.findOrthogonalVector(vectorFromCarToWall));
    // }

    // private static findOrthogonalVector(vector: Vector3): Vector3 {
    //     return new Vector3(vector.z, 0, - vector.x);
    // }

    private static isSphereIntersectingWallPlane(sphere: Sphere, plane: WallPlane): boolean {
        if (!sphere.intersectsPlane(plane)) {
            return false;
        }
        this.projectedPointOnPlane = plane.projectPoint(sphere.center.clone());

        return plane.isPointBetweenWallLimits(this.projectedPointOnPlane);
    }
}
