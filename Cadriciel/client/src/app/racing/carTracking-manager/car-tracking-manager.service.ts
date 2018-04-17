import { Injectable } from "@angular/core";
import { Vector3, Sphere } from "three";
import { RaceProgressTracker } from "./raceProgressTracker";
import { TRACKING_SPHERE_RADIUS, NUMBER_OF_LAPS } from "../constants/car.constants";

const FINISH_BUFFER: number = 2;

@Injectable()
export class CarTrackingManagerService {

    private _detectionSpheres: Sphere[];
    private _finishLinePosition: Vector3;
    private _finishLineSegment: Vector3;

    public constructor() {
        this._detectionSpheres = [];
    }

    public init(trackVertices: Vector3[], finishLinePosition: Vector3, finishLineSegment: Vector3): void {
        this._finishLinePosition = finishLinePosition;
        this._finishLineSegment = finishLineSegment;
        this.createDetectionSpheres(trackVertices);
    }

    private createDetectionSpheres(trackVertices: Vector3[]): void {
        trackVertices.forEach((coordinate: Vector3) => {
            this._detectionSpheres.push(new Sphere(new Vector3(coordinate.x, coordinate.y, coordinate.z), TRACKING_SPHERE_RADIUS));
        });
    }

    public update(position: Vector3, raceProgressTracker: RaceProgressTracker): boolean {
        if (this.isLastStretch(raceProgressTracker)) {
            if (this.isAtFinishLine(position, raceProgressTracker)) {
                raceProgressTracker.isRaceCompleted = true;
            }
        } else if (this.isRightSequence(position, raceProgressTracker)) {
            raceProgressTracker.incrementIndexCount();
            this.goToNextSphere(raceProgressTracker);
        }

        return raceProgressTracker.isRaceCompleted && !raceProgressTracker.isTimeLogged;
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

    private isLastStretch(raceProgressTracker: RaceProgressTracker): boolean {
        return raceProgressTracker.segmentCounted === this._detectionSpheres.length * NUMBER_OF_LAPS;
    }

    private isAtFinishLine(position: Vector3, raceProgressTracker: RaceProgressTracker): boolean {
        const carToFinishLine: Vector3 = this._finishLinePosition.clone().sub(position);
        const parallelDistance: number = (carToFinishLine.clone().projectOnVector(this._finishLineSegment)).length();
        if (parallelDistance < FINISH_BUFFER) {
            raceProgressTracker.incrementIndexCount();

            return true;
        }

        return false;
    }
}
