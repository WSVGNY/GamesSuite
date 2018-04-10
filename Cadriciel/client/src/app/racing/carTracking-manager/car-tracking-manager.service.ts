import { Injectable } from "@angular/core";
import { Vector3, Sphere } from "three";
import { CommonCoordinate3D } from "../../../../../common/racing/commonCoordinate3D";
import { Car } from "../car/car";
import { TRACKING_SPHERE_RADIUS, NUMBER_OF_LAPS } from "../constants";

@Injectable()
export class CarTrackingManagerService {

    private _detectionSpheres: Sphere[];
    private _car: Car;
    private _currentIndex: number;
    private _lapCounter: number;
    private _isCompleted: boolean;

    public constructor() {
        this._detectionSpheres = [];
        this._currentIndex = 0;
        this._lapCounter = 0;
    }

    public init(trackVertices: CommonCoordinate3D[], car: Car): void {
        this._car = car;
        this.createDetectionSpheres(trackVertices);
        car.trackPortionIndex = 0;
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
        if (this.isRightSequence()) {
            this._lapCounter++;
            this.goToNextSphere();
            this.updateTrackPortionIndex();
            if (this.isRaceCompleted()) {
                this._isCompleted = true;
            }
        }
    }

    private updateTrackPortionIndex(): void {
        this._car.trackPortionIndex = this._currentIndex === 0 ?
            this._detectionSpheres.length - 1 :
            this._currentIndex - 1;
    }

    private isRaceCompleted(): boolean {
        return this._lapCounter > this._detectionSpheres.length * NUMBER_OF_LAPS;
    }
}
