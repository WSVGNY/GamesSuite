import { Injectable } from "@angular/core";
import { Vector3, Sphere } from "three";
import { RaceProgressTracker } from "./raceProgressTracker";
import { TRACKING_SPHERE_RADIUS, NUMBER_OF_LAPS } from "../constants/car.constants";

const FINISH_BUFFER: number = 3;

@Injectable()
export class CarTrackingService {

    private _detectionSpheres: Sphere[];
    private _finishLinePosition: Vector3;
    private _finishLineSegment: Vector3;

    public constructor() {
        this._detectionSpheres = [];
    }

    public init(trackVertices: Vector3[], finishLinePosition: Vector3, finishLineSegment: Vector3): void {
        this.createDetectionSpheres(trackVertices);
        this._finishLinePosition = finishLinePosition;
        this._finishLineSegment = finishLineSegment;
    }

    private createDetectionSpheres(trackVertices: Vector3[]): void {
        trackVertices.forEach((coordinate: Vector3) => {
            this._detectionSpheres.push(new Sphere(new Vector3(coordinate.x, coordinate.y, coordinate.z), TRACKING_SPHERE_RADIUS));
        });
    }

    public update(position: Vector3, raceProgressTracker: RaceProgressTracker): void {
        if (this.isRightSequence(position, raceProgressTracker)) {
            raceProgressTracker.shouldBeInStartingSphere = this.isCarAtStartingSphere(position);
            raceProgressTracker.incrementIndexCount();
            this.goToNextSphere(raceProgressTracker);
        }
    }

    public isLapComplete(position: Vector3, raceProgressTracker: RaceProgressTracker): boolean {
        if (this.isFinishLineCrossed(position, raceProgressTracker)) {
            raceProgressTracker.incrementLapCount();
            if (raceProgressTracker.lapCount > NUMBER_OF_LAPS) {
                raceProgressTracker.isRaceCompleted = true;
            }

            return true;
        }

        return false;
    }

    private isFinishLineCrossed(position: Vector3, raceProgressTracker: RaceProgressTracker): boolean {
        return this.isOnLastSegmentOfLap(raceProgressTracker) &&
            this.isAtFinishLine(position, raceProgressTracker) &&
            raceProgressTracker.lapCount === (raceProgressTracker.segmentCounted / this._detectionSpheres.length);
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
            && !raceProgressTracker.shouldBeInStartingSphere;
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

    private isOnLastSegmentOfLap(raceProgressTracker: RaceProgressTracker): boolean {
        return raceProgressTracker.segmentCounted % this._detectionSpheres.length === 0;
    }

    private isAtFinishLine(position: Vector3, raceProgressTracker: RaceProgressTracker): boolean {
        const carToFinishLine: Vector3 = this._finishLinePosition.clone().sub(position);
        const parallelDistance: number = (carToFinishLine.clone().projectOnVector(this._finishLineSegment)).length();

        return parallelDistance < FINISH_BUFFER;
    }

    public resetIsLapComplete(raceProgressTracker: RaceProgressTracker): void {
        raceProgressTracker.isLapCompleted = false;
    }
}
