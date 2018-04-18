import { Injectable } from "@angular/core";
import { Vector3, Sphere } from "three";
import { RaceProgressTracker } from "./raceProgressTracker";
import { TRACKING_SPHERE_RADIUS, NUMBER_OF_LAPS } from "../constants/car.constants";

const FINISH_BUFFER: number = 3;

@Injectable()
export class CarTrackingManagerService {

    private _detectionSpheres: Sphere[];
    private _finishLinePosition: Vector3;
    private _finishLineSegment: Vector3;
    private _shouldBeInStartingSphere: boolean;

    public constructor() {
        this._detectionSpheres = [];
        this._shouldBeInStartingSphere = false;
    }

    public init(trackVertices: Vector3[], finishLinePosition: Vector3, finishLineSegment: Vector3): void {
        this.createDetectionSpheres(trackVertices);
        this.computeFinishLine(trackVertices);
    }

    private computeFinishLine(trackVertices: Vector3[]): void {
        const firstVertex: Vector3 = new Vector3(trackVertices[0].x, trackVertices[0].y, trackVertices[0].z);
        const secondVertex: Vector3 = new Vector3(trackVertices[1].x, trackVertices[1].y, trackVertices[1].z);
        const firstToSecondVertex: Vector3 = secondVertex.clone().sub(firstVertex);
        const direction: Vector3 = firstToSecondVertex.clone().normalize();

        this._finishLinePosition = firstVertex.clone().add(direction.clone().multiplyScalar(firstToSecondVertex.length() / 2));
        this._finishLineSegment = direction.clone();
    }

    private createDetectionSpheres(trackVertices: Vector3[]): void {
        trackVertices.forEach((coordinate: Vector3) => {
            this._detectionSpheres.push(new Sphere(new Vector3(coordinate.x, coordinate.y, coordinate.z), TRACKING_SPHERE_RADIUS));
        });
    }

    public update(position: Vector3, raceProgressTracker: RaceProgressTracker): void {
        if (this.isRightSequence(position, raceProgressTracker)) {
            this._shouldBeInStartingSphere = this.isCarAtStartingSphere(position);
            raceProgressTracker.incrementIndexCount();
            this.goToNextSphere(raceProgressTracker);
        }
    }

    public isLapComplete(position: Vector3, raceProgressTracker: RaceProgressTracker): boolean {
        if (this.isOnLastSegmentOfLap(raceProgressTracker)) {
            if (this.isAtFinishLine(position, raceProgressTracker)) {
                if (raceProgressTracker.lapCount === (raceProgressTracker.segmentCounted / this._detectionSpheres.length)) {
                    raceProgressTracker.incrementLapCount();
                    console.log("lap number " + raceProgressTracker.lapCount);
                    if (raceProgressTracker.lapCount > NUMBER_OF_LAPS) {
                        raceProgressTracker.isRaceCompleted = true;
                    }

                    return true;
                }
            }
        }

        return false;
    }

    private isRightSequence(position: Vector3, raceProgressTracker: RaceProgressTracker): boolean {
        if (this.isWrongSequence(position, raceProgressTracker)) {
            raceProgressTracker.resetCurrentSegmentIndex(this._detectionSpheres.length);

            return false;
        }

        return this.isCarAtDesiredSphere(position, raceProgressTracker);
    }

    private isWrongSequence(position: Vector3, raceProgressTracker: RaceProgressTracker): boolean {
        return this.isCarAtStartingSphere(position)
            && !this.isCarAtDesiredSphere(position, raceProgressTracker)
            && !this._shouldBeInStartingSphere;
    }

    private isCarAtStartingSphere(position: Vector3): boolean {
        return this.sphereContainsCar(this._detectionSpheres[0], position);
    }

    private sphereContainsCar(sphere: Sphere, position: Vector3): boolean {
        return sphere.containsPoint(position);
    }

    private isCarAtDesiredSphere(position: Vector3, raceProgressTracker: RaceProgressTracker): boolean {
        // if (raceProgressTracker.currentSegmentIndex === 0) {
        //     console.log("CurrentSegmentIndex : " + raceProgressTracker.currentSegmentIndex);
        //     console.log("CurrentDetectionSphere: " + this._detectionSpheres[raceProgressTracker.currentSegmentIndex]);
        //     raceProgressTracker.didonce = true;
        // }

        return this.sphereContainsCar(this._detectionSpheres[raceProgressTracker.currentSegmentIndex], position);
    }

    private goToNextSphere(raceProgressTracker: RaceProgressTracker): void {
        raceProgressTracker.incrementCurrentIndex(this._detectionSpheres.length);
    }

    // private isLastStretch(raceProgressTracker: RaceProgressTracker): boolean {
    //     return raceProgressTracker.segmentCounted === this._detectionSpheres.length * NUMBER_OF_LAPS;
    // }

    private isOnLastSegmentOfLap(raceProgressTracker: RaceProgressTracker): boolean {
        return raceProgressTracker.segmentCounted % this._detectionSpheres.length === 0;
    }

    private isAtFinishLine(position: Vector3, raceProgressTracker: RaceProgressTracker): boolean {
        const carToFinishLine: Vector3 = this._finishLinePosition.clone().sub(position);
        const parallelDistance: number = (carToFinishLine.clone().projectOnVector(this._finishLineSegment)).length();
        if (parallelDistance < FINISH_BUFFER) {

            return true;
        }

        return false;
    }

    public resetIsLapComplete(raceProgressTracker: RaceProgressTracker): void {
        raceProgressTracker.isLapCompleted = false;
    }
}
