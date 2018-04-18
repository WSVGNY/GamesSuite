import { Injectable } from "@angular/core";
import { Vector3 } from "three";
import { RaceProgressTracker } from "../carTracking-manager/raceProgressTracker";
import { NUMBER_OF_LAPS } from "../constants/car.constants";

const AVERAGE_CAR_SPEED: number = 45;
const MS_TO_SEC: number = 1000;

@Injectable()
export class GameTimeManagerService {

    private _startDate: number;
    private _lastDate: number;

    public initializeDates(): void {
        this._startDate = 0;
        this._lastDate = 0;
    }

    public getElaspedTime(): number {
        return Date.now() - this._startDate;
    }

    public getTimeSinceLastFrame(): number {
        return Date.now() - this._lastDate;
    }

    public resetStartDate(): void {
        this._startDate = Date.now();
    }

    public updateLastDate(): void {
        this._lastDate = Date.now();
    }

    public simulateRaceTime(raceProgressTracker: RaceProgressTracker, currentPosition: Vector3, trackVertices: Vector3[]): number {
        const lapSegmentCount: number = trackVertices.length;
        const raceSegmentCount: number = lapSegmentCount * NUMBER_OF_LAPS;
        const remainingSegmentCount: number = raceSegmentCount - raceProgressTracker.segmentCounted;
        const remainingLapCount: number = Math.floor(remainingSegmentCount / lapSegmentCount);

        return this.getElaspedTime() / MS_TO_SEC +
            this.simulateCompleteLapTime(trackVertices, remainingLapCount) +
            this.simulatePartialLapTime(trackVertices, raceProgressTracker.currentSegmentIndex) +
            this.simulatePartialSegmentTime(currentPosition, trackVertices, raceProgressTracker.currentSegmentIndex) +
            this.simulateTimeToFinishLine(currentPosition, trackVertices, raceProgressTracker.currentSegmentIndex);

    }

    private simulateCompleteLapTime(trackVertices: Vector3[], lapAmount: number): number {
        let simulatedTime: number = 0;
        for (let i: number = 0; i < trackVertices.length; ++i) {
            if ((i + 1) !== trackVertices.length) {
                simulatedTime += (trackVertices[i].distanceTo(trackVertices[i + 1]) / AVERAGE_CAR_SPEED);
            }
        }

        return simulatedTime * lapAmount;
    }

    private simulatePartialLapTime(trackVertices: Vector3[], currentSegmentIndex: number): number {
        let simulatedTime: number = 0;
        if (currentSegmentIndex !== 0 && currentSegmentIndex !== 1) {
            for (let i: number = currentSegmentIndex; i < trackVertices.length; ++i) {
                simulatedTime += ((i + 1) !== trackVertices.length) ?
                    (trackVertices[i].distanceTo(trackVertices[i + 1]) / AVERAGE_CAR_SPEED) :
                    (trackVertices[i].distanceTo(trackVertices[0]) / AVERAGE_CAR_SPEED);
            }
        }

        return simulatedTime;
    }

    private simulatePartialSegmentTime(position: Vector3, trackVertices: Vector3[], currentSegmentIndex: number): number {
        let simulatedTime: number = 0;
        if (currentSegmentIndex !== 1) {
            simulatedTime = (position.distanceTo(trackVertices[currentSegmentIndex]) / AVERAGE_CAR_SPEED);
        }

        return simulatedTime;

    }

    private simulateTimeToFinishLine(position: Vector3, trackVertices: Vector3[], currentSegmentIndex: number): number {
        const firstVertex: Vector3 = new Vector3(trackVertices[0].x, trackVertices[0].y, trackVertices[0].z);
        const secondVertex: Vector3 = new Vector3(trackVertices[1].x, trackVertices[1].y, trackVertices[1].z);
        const firstToSecondVertex: Vector3 = secondVertex.clone().sub(firstVertex);
        const direction: Vector3 = firstToSecondVertex.clone().normalize();
        const finishLinePosition: Vector3 = firstVertex.clone().add(direction.clone().multiplyScalar(firstToSecondVertex.length() / 2));

        return (currentSegmentIndex !== 1) ?
            trackVertices[0].distanceTo(finishLinePosition) / AVERAGE_CAR_SPEED :
            position.distanceTo(finishLinePosition) / AVERAGE_CAR_SPEED;

    }

}
