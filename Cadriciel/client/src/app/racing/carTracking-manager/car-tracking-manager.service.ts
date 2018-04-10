import { Injectable } from "@angular/core";
import { TrackingSphere } from "./sphereDetection";
import { Vector3 } from "three";
import { CommonCoordinate3D } from "../../../../../common/racing/commonCoordinate3D";
import { Car } from "../car/car";

@Injectable()
export class CarTrackingManagerService {

    private _detectionSpheres: TrackingSphere[];
    private _trackVertices: Vector3[];

    public constructor() {
        this._detectionSpheres = [];
        this._trackVertices = [];
    }

    public init(trackVertices: CommonCoordinate3D[], car: Car): void {
        this._trackVertices = [];
        trackVertices.forEach((coordinate: CommonCoordinate3D) => {
            this._trackVertices.push(new Vector3(coordinate.x, coordinate.y, coordinate.z));
        });
        this.createDetectionSpheres();
        car.trackPortionIndex = 0;
    }

    private resetDetectionSpheres(): void {
        for (let i: number = 0; i < this._trackVertices.length; ++i) {
            this._detectionSpheres[i].isDetected = false;
        }
    }

    private carPassedDetectionSphere (car: Car ): boolean {
        for (let i: number = 0; i < this._detectionSpheres.length; i++) {
            if (this._detectionSpheres[i].containsPoint(car.currentPosition)) {
                if (this._detectionSpheres[i].isDetected === false) {
                        this._detectionSpheres[i].isDetected = true;

                        return true;
                }
            }
        }

        return false;
    }

    private createDetectionSpheres(): void {
        for (let i: number = 0; i < this._trackVertices.length; ++i) {
            this._detectionSpheres.push(new TrackingSphere(this._trackVertices[i]));
            this._detectionSpheres[i].sphereIndex = i;
        }
    }

    private carPassedFirstDetectionSphere (car: Car): boolean {
        return this._detectionSpheres[0].containsPoint(car.currentPosition);
    }

    public updateTrackPortionIndex(car: Car): void {
        if (this.carPassedDetectionSphere(car) === true) {
            if (car.trackPortionIndex + 1 >= this._trackVertices.length) {
                console.log("HELLO");
                car.trackPortionIndex = 1;
                this.resetDetectionSpheres();
            } else {
                car.trackPortionIndex++;
            }
        }
    }

}
