import { Injectable } from "@angular/core";
import { TrackingSphere } from "./sphereDetection";
import { Vector3 } from "three";
import { CommonCoordinate3D } from "../../../../../common/racing/commonCoordinate3D";
import { Car } from "../car/car";

@Injectable()
export class CarTrackingManagerService {

    private _detectionSpheres: TrackingSphere[];
    private _car: Car;
    private _currentIndex: number;
    private _nextIndex: number;

    public constructor() {
        this._detectionSpheres = [];
        this._currentIndex = 0;
        this._nextIndex = this._currentIndex + 1;
    }

    public init(trackVertices: CommonCoordinate3D[], car: Car): void {
        this._car = car;
        this.createDetectionSpheres(trackVertices);
        car.trackPortionIndex = 0;
    }

    private createDetectionSpheres(trackVertices: CommonCoordinate3D[]): void {
        trackVertices.forEach((coordinate: CommonCoordinate3D) => {
            this._detectionSpheres.push(new TrackingSphere(new Vector3(coordinate.x, coordinate.y, coordinate.z)));
        });
    }

    // private resetDetectionSpheres(): void {
    //     for (let i: number = 0; i < this._trackVertices.length; ++i) {
    //         this._detectionSpheres[i].isDetected = false;
    //     }
    // }

    private isCarAtDesiredSphere(sphere: TrackingSphere): boolean {
        return sphere.containsPoint(this._car.currentPosition);

    }

    private goToNextSphere(): void {
        this._currentIndex++;
        this._currentIndex %= this._detectionSpheres.length;
        this._nextIndex = this._currentIndex + 1;
        this._nextIndex %= this._detectionSpheres.length;
    }

    // private carPassedDetectionSphere(car: Car): boolean {
    //     if (this.isCarInsideOfSphere(car)) {
    //         if (!this._detectionSpheres[i].isDetected) {
    //             this._detectionSpheres[i].isDetected = true;

    //             return true;
    //         }
    //     }


    //     return false;
    // }

    // private carPassedFirstDetectionSphere (car: Car): boolean {
    //     return this._detectionSpheres[0].containsPoint(car.currentPosition);
    // }

    public updateTrackPortionIndex(): void {
        if (this.isCarAtDesiredSphere(this._detectionSpheres[this._currentIndex])) {
            console.log("ALLO");
            console.log(this._currentIndex);
            // console.log(this._car.trackPortionIndex);
            this.goToNextSphere();
            console.log("ALLOALLO");
            console.log(this._currentIndex);
            // console.log(this._car.trackPortionIndex);

            this._car.trackPortionIndex = this._currentIndex === 0 ? this._detectionSpheres.length : this._currentIndex - 1;
            this._car.trackPortionIndex %= this._detectionSpheres.length;
        }
        // if (this.carPassedDetectionSphere(car)) {
        //     if (car.trackPortionIndex + 1 >= this._trackVertices.length) {
        //         car.trackPortionIndex = 1; // maybe mauvais
        //         this.resetDetectionSpheres();
        //     } else {
        //         car.trackPortionIndex++;
        //     }
        // }
    }

}
