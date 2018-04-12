import { Injectable } from "@angular/core";
import { Vector3, Sphere } from "three";
import { CommonCoordinate3D } from "../../../../../common/racing/commonCoordinate3D";
import { Car } from "../car/car";
import { TRACKING_SPHERE_RADIUS, NUMBER_OF_LAPS, HALF_TRACK_WIDTH } from "../constants";

@Injectable()
export class CarTrackingManagerService {

    private _detectionSpheres: Sphere[];
    private _car: Car;
    private _currentIndex: number;
    private _lapCounter: number;
    private _isCompleted: boolean;
    private _endPoint: Vector3;

    public constructor() {
        this._detectionSpheres = [];
        this._currentIndex = 1;
        this._lapCounter = 0;
    }

    public init(trackVertices: CommonCoordinate3D[], car: Car): void {
        this._car = car;
        this.initializeEndPoint(trackVertices);
        this.createDetectionSpheres(trackVertices);
        car.trackPortionIndex = 0;
    }

    private initializeEndPoint(trackVertices: CommonCoordinate3D[]): void {
        this._endPoint = new Vector3(
            (trackVertices[1].x - trackVertices[0].x) / 2,
            (trackVertices[1].y - trackVertices[0].y) / 2,
            (trackVertices[1].z - trackVertices[0].z) / 2);
    }

    public get isCompleted(): boolean {
        return this._isCompleted;
    }

    private createDetectionSpheres(trackVertices: CommonCoordinate3D[]): void {
        trackVertices.forEach((coordinate: CommonCoordinate3D) => {
            this._detectionSpheres.push(new Sphere(new Vector3(coordinate.x, coordinate.y, coordinate.z), TRACKING_SPHERE_RADIUS));
        });
    }

    private isRightSequence(): boolean {
        if (this.isCarAtStartingSphere() && !this.isCarAtDesiredSphere()) {
            this._currentIndex = 1;

            return false;
        }

        return this.isCarAtDesiredSphere();
    }

    private isCarAtDesiredSphere(): boolean {
        return this.sphereContainsCar(this._detectionSpheres[this._currentIndex]);
    }

    private isCarAtStartingSphere(): boolean {
        return this.sphereContainsCar(this._detectionSpheres[0]);
    }

    private goToNextSphere(): void {
        this._currentIndex++;
        this._currentIndex %= this._detectionSpheres.length;
    }

    private sphereContainsCar(sphere: Sphere): boolean {
        return sphere.containsPoint(this._car.currentPosition);
    }

    public update(): void {
        if (this.isLastStretch()) {
            this.isAtFinishLine();
            // console.log("last: " + this._lapCounter);
            if (this.isRaceCompleted()) {
                this._isCompleted = true;
            }
        } else if (this.isRightSequence()) {
            this._lapCounter++;
            // console.log("right: " + this._lapCounter);
            this.goToNextSphere();
            this.updateTrackPortionIndex();
        }
    }

    private updateTrackPortionIndex(): void {
        this._car.trackPortionIndex = this._currentIndex === 0 ?
            this._detectionSpheres.length - 1 :
            this._currentIndex - 1;
    }

    private isLastStretch(): boolean {
        return this._lapCounter === this._detectionSpheres.length * NUMBER_OF_LAPS;
    }

    private isRaceCompleted(): boolean {
        return this._lapCounter > this._detectionSpheres.length * NUMBER_OF_LAPS;
    }

    private isAtFinishLine(): boolean {
        if (
            (Math.abs(this._car.currentPosition.x - this._endPoint.x) < 1) &&
            ((Math.abs(this._car.currentPosition.z - this._endPoint.z) < HALF_TRACK_WIDTH))) {
            // console.log(this._endPoint);
            // console.log(this._car.currentPosition);
            this._lapCounter++;
        }

        return true;
    }
}
