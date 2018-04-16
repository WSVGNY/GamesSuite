import { Injectable } from "@angular/core";
import { Vector3 } from "three";
import { RaceProgressTracker } from "../carTracking-manager/raceProgressTracker";
import { Track } from "../../../../../common/racing/track";
import { NUMBER_OF_LAPS } from "../constants/car.constants";

const AVERAGE_CAR_SPEED: number = 45;

@Injectable()
export class GameTimeManagerService {

    private _startDate: number;
    private _lastDate: number;

    public constructor() {
        this.initializeDates();
    }

    private initializeDates(): void {
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

    public simulateRaceTime(raceProgressTracker: RaceProgressTracker, currentPosition: Vector3, track: Track): number {
        const lapSegmentCount: number = track.vertices.length;
        const raceSegmentCount: number = lapSegmentCount * NUMBER_OF_LAPS;
        const remainingSegmentCount: number = raceSegmentCount - raceProgressTracker.segmentCounted;
        const remainingLapCount: number = Math.floor(remainingSegmentCount / lapSegmentCount);

        return this.getElaspedTime() +
            this.simulateCompleteLapTime(track, remainingLapCount) +
            this.simulatePartialLapTime(track, raceProgressTracker.currentSegmentIndex) +
            this.simulatePartialSegmentTime(currentPosition, track, raceProgressTracker.currentSegmentIndex);

    }

    private simulateCompleteLapTime(track: Track, lapAmount: number): number {
        let simulatedTime: number = 0;
        for (let i: number = 0; i < track.vertices.length; ++i) {
            if ((i + 1) !== track.vertices.length) {
                const currentVertice: Vector3 = new Vector3(track.vertices[i].x, 0, track.vertices[i].z);
                const nextVertice: Vector3 = new Vector3(track.vertices[i + 1].x, 0, track.vertices[i + 1].z);
                simulatedTime += (currentVertice.distanceTo(nextVertice) / AVERAGE_CAR_SPEED);
            }
        }

        return simulatedTime * lapAmount;
    }

    private simulatePartialLapTime(track: Track, currentSegmentIndex: number): number {
        let simulatedTime: number = 0;
        if (currentSegmentIndex !== 0) {
            for (let i: number = currentSegmentIndex; i < track.vertices.length; ++i) {
                if ((i + 1) !== track.vertices.length) {
                    const currentVertice: Vector3 = new Vector3(track.vertices[i].x, 0, track.vertices[i].z);
                    const nextVertice: Vector3 = new Vector3(track.vertices[i + 1].x, 0, track.vertices[i + 1].z);
                    simulatedTime += (currentVertice.distanceTo(nextVertice) / AVERAGE_CAR_SPEED);
                }
            }
        }

        return simulatedTime;
    }

    private simulatePartialSegmentTime(position: Vector3, track: Track, currentSegmentIndex: number): number {
        const nextTrackVertex: Vector3 = new Vector3(
            track.vertices[currentSegmentIndex].x,
            0,
            track.vertices[currentSegmentIndex].z
        );

        return (position.distanceTo(nextTrackVertex) / AVERAGE_CAR_SPEED);
    }

}
