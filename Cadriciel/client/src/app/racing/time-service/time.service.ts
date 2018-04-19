import { Injectable } from "@angular/core";
import { Vector3 } from "three";
import { NUMBER_OF_LAPS, AVERAGE_CAR_SPEED } from "../constants/car.constants";
import { RaceProgressTracker } from "../tracking-service/raceProgressTracker";
import { MS_TO_SECONDS } from "../constants/math.constants";

@Injectable()
export class TimeService {

    private _startDate: number;
    private _lastDate: number;

    public initialize(): void {
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

    public simulateRaceTime(
        raceProgressTracker: RaceProgressTracker,
        currentPosition: Vector3,
        trackVertices: Vector3[],
        startingLine: Vector3
    ): number {
        const lapSegmentCount: number = trackVertices.length;
        const raceSegmentCount: number = lapSegmentCount * NUMBER_OF_LAPS;
        const remainingSegmentCount: number = raceSegmentCount - raceProgressTracker.segmentCounted;
        const remainingLapCount: number = Math.floor(remainingSegmentCount / lapSegmentCount);

        return this.getElaspedTime() * MS_TO_SECONDS +
            this.simulateCompleteLapTime(trackVertices, remainingLapCount) +
            this.simulatePartialLapTime(trackVertices, raceProgressTracker.currentSegmentIndex) +
            this.simulatePartialSegmentTime(currentPosition, trackVertices, raceProgressTracker.currentSegmentIndex) +
            this.simulateTimeToFinishLine(currentPosition, trackVertices, raceProgressTracker.currentSegmentIndex, startingLine);

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

    private simulatePartialLapTime(trackVertices: Vector3[], segmentIndex: number): number {
        let simulatedTime: number = 0;
        if (segmentIndex !== 0 && segmentIndex !== 1) {
            for (let i: number = segmentIndex; i < trackVertices.length; ++i) {
                simulatedTime += ((i + 1) !== trackVertices.length) ?
                    (trackVertices[i].distanceTo(trackVertices[i + 1]) / AVERAGE_CAR_SPEED) :
                    (trackVertices[i].distanceTo(trackVertices[0]) / AVERAGE_CAR_SPEED);
            }
        }

        return simulatedTime;
    }

    private simulatePartialSegmentTime(position: Vector3, trackVertices: Vector3[], segmentIndex: number): number {
        let simulatedTime: number = 0;
        if (segmentIndex !== 1) {
            simulatedTime = (position.distanceTo(trackVertices[segmentIndex]) / AVERAGE_CAR_SPEED);
        }

        return simulatedTime;

    }

    private simulateTimeToFinishLine(position: Vector3, trackVertices: Vector3[], segmentIndex: number, startingLine: Vector3): number {
        return (segmentIndex !== 1) ?
            trackVertices[0].distanceTo(startingLine) / AVERAGE_CAR_SPEED :
            position.distanceTo(startingLine) / AVERAGE_CAR_SPEED;
    }

}
