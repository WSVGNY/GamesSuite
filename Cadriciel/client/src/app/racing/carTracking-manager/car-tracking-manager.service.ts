import { Injectable } from "@angular/core";
import { Vector3, Sphere } from "three";
import { CommonCoordinate3D } from "../../../../../common/racing/commonCoordinate3D";
import { TRACKING_SPHERE_RADIUS, NUMBER_OF_LAPS } from "../constants";
import { RaceProgressTracker } from "./raceProgressTracker";

@Injectable()
export class CarTrackingManagerService {

    private _detectionSpheres: Sphere[];

    public constructor() {
        this._detectionSpheres = [];
    }

    public init(trackVertices: CommonCoordinate3D[]): void {
        this.createDetectionSpheres(trackVertices);
    }

    private createDetectionSpheres(trackVertices: CommonCoordinate3D[]): void {
        trackVertices.forEach((coordinate: CommonCoordinate3D) => {
            this._detectionSpheres.push(new Sphere(new Vector3(coordinate.x, coordinate.y, coordinate.z), TRACKING_SPHERE_RADIUS));
        });
    }

    public update(position: Vector3, raceProgressTracker: RaceProgressTracker): boolean {
        if (this.isRightSequence(position, raceProgressTracker)) {
            raceProgressTracker.incrementIndexCount();
            this.goToNextSphere(raceProgressTracker);
            // this.updateTrackPortionIndex();
            if (this.isRaceCompleted(raceProgressTracker)) {
                raceProgressTracker.isRaceCompleted = true;
            }
        }

        return raceProgressTracker.isRaceCompleted;
    }

    private isRightSequence(position: Vector3, raceProgressTracker: RaceProgressTracker): boolean {
        if (this.isCarAtStartingSphere(position) && !this.isCarAtDesiredSphere(position, raceProgressTracker)) {
            raceProgressTracker.resetCurrentSegmentIndex();

            return false;
        }

        return this.isCarAtDesiredSphere(position, raceProgressTracker);
    }

    private isCarAtStartingSphere(position: Vector3): boolean {
        return this.sphereContainsCar(this._detectionSpheres[0], position);
    }

    private sphereContainsCar(sphere: Sphere, position: Vector3): boolean {
        return sphere.containsPoint(position);
    }

    private isCarAtDesiredSphere(position: Vector3, raceProgressTracker: RaceProgressTracker): boolean {
        return this.sphereContainsCar(this._detectionSpheres[raceProgressTracker.currentSegmentIndex], position);
    }

    private goToNextSphere(raceProgressTracker: RaceProgressTracker): void {
        raceProgressTracker.incrementCurrentIndex(this._detectionSpheres.length);
    }

    // private updateTrackPortionIndex(): void {
    //     this._car.trackPortionIndex = this._currentIndex === 0 ?
    //         this._detectionSpheres.length - 1 :
    //         this._currentIndex - 1;
    // }

    private isRaceCompleted(raceProgressTracker: RaceProgressTracker): boolean {
        return raceProgressTracker.segmentCounted > this._detectionSpheres.length * NUMBER_OF_LAPS;
    }
}
