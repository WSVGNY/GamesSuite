import { Injectable } from "@angular/core";
import { Vector3, Sphere } from "three";
import { RaceProgressTracker } from "./raceProgressTracker";
import { TRACKING_SPHERE_RADIUS, NUMBER_OF_LAPS } from "../constants/car.constants";

@Injectable()
export class CarTrackingManagerService {

    private _detectionSpheres: Sphere[];
    private _finishLinePosition: Vector3;
    private _finishLineSegment: Vector3;

    public constructor() {
        this._detectionSpheres = [];
    }

    public init(trackVertices: Vector3[]): void {
        this.createDetectionSpheres(trackVertices);
        this.computeFinishLine(trackVertices);
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

    // private updateTrackPortionIndex(): void {
    //     this._car.trackPortionIndex = this._currentIndex === 0 ?
    //         this._detectionSpheres.length - 1 :
    //         this._currentIndex - 1;
    // }

    // private isRaceCompleted(raceProgressTracker: RaceProgressTracker): boolean {
    //     return raceProgressTracker.segmentCounted > this._detectionSpheres.length * NUMBER_OF_LAPS;
    // }

    private computeFinishLine(trackVertices: Vector3[]): void {
        const firstVertex: Vector3 = new Vector3(trackVertices[0].x, trackVertices[0].y, trackVertices[0].z);
        const secondVertex: Vector3 = new Vector3(trackVertices[1].x, trackVertices[1].y, trackVertices[1].z);
        const firstToSecondVertex: Vector3 = secondVertex.clone().sub(firstVertex);
        const direction: Vector3 = firstToSecondVertex.clone().normalize();

        this._finishLinePosition = firstVertex.clone().add(direction.clone().multiplyScalar(firstToSecondVertex.length() / 2));
        this._finishLineSegment = direction.clone();
    }

    private isLastStretch(raceProgressTracker: RaceProgressTracker): boolean {
        return raceProgressTracker.segmentCounted === this._detectionSpheres.length * NUMBER_OF_LAPS;
    }

    private isAtFinishLine(position: Vector3, raceProgressTracker: RaceProgressTracker): boolean {
        const carToFinishLine: Vector3 = this._finishLinePosition.clone().sub(position);
        const parallelDistance: number = (carToFinishLine.clone().projectOnVector(this._finishLineSegment)).length();
        if (parallelDistance < 2) {
            raceProgressTracker.incrementIndexCount();

            return true;
        }

        return false;
    }
}
