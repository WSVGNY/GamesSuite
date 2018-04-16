import { Injectable } from "@angular/core";
import { Vector3 } from "three";
import { RaceProgressTracker } from "../carTracking-manager/raceProgressTracker";
import { Track } from "../../../../../common/racing/track";

@Injectable()
export class GameTimeManagerService {

    private _lastFrameDate: number;
    private _raceStartDate: number;

    private _startDate: number;
    private _elaspedTime: number;

    public constructor() {
        this._lastFrameDate = 0;
        this._raceStartDate = 0;
    }

    public initializeTimes(): void {
        this._lastFrameDate = Date.now();
        this._raceStartDate = Date.now();
    }

    public get lastDate(): number {
        return this._lastFrameDate;
    }

    public get startDate(): number {
        return this._raceStartDate;
    }

    public get elaspedTime(): number {
        return this._elaspedTime;
    }

    public getTimeSinceLastFrame(): number {
        return Date.now() - this._lastFrameDate;
    }

    public resetStartDate(): void {
        this._startDate = Date.now();
        this._elaspedTime = 0;
    }

    public simulateRaceTime(raceProgressTracker: RaceProgressTracker, position: Vector3, track: Track): number {
        const lapSegmentAmount: number = this._chosenTrack.vertices.length;
        const totalSegmentAmount: number = lapSegmentAmount * NUMBER_OF_LAPS;
        const segmentsToGo: number = totalSegmentAmount - segmentCounted;
        const completeLapsToGo: number = Math.floor(segmentsToGo / lapSegmentAmount);

        return this.simulateCompleteLapTime(completeLapsToGo) +
            this.simulatePartialLapTime(currentSegmentIndex) +
            this.simulatePartialSegmentTime(currentSegmentIndex, position);

    }

    private simulateCompleteLapTime(lapAmount: number): number {
        let simulatedTime: number = 0;
        for (let i: number = 0; i < this._chosenTrack.vertices.length; ++i) {
            if ((i + 1) !== this._chosenTrack.vertices.length) {
                const currentVertice: Vector3 = new Vector3(this._chosenTrack.vertices[i].x, 0, this._chosenTrack.vertices[i].z);
                const nextVertice: Vector3 = new Vector3(this._chosenTrack.vertices[i + 1].x, 0, this._chosenTrack.vertices[i + 1].z);
                simulatedTime += (currentVertice.distanceTo(nextVertice) / AVERAGE_CAR_SPEED);
            }
        }

        return simulatedTime * lapAmount;
    }

    private simulatePartialLapTime(currentSegmentIndex: number): number {
        let simulatedTime: number = 0;
        if (currentSegmentIndex !== 0) {
            for (let i: number = currentSegmentIndex; i < this._chosenTrack.vertices.length; ++i) {
                if ((i + 1) !== this._chosenTrack.vertices.length) {
                    const currentVertice: Vector3 = new Vector3(this._chosenTrack.vertices[i].x, 0, this._chosenTrack.vertices[i].z);
                    const nextVertice: Vector3 = new Vector3(this._chosenTrack.vertices[i + 1].x, 0, this._chosenTrack.vertices[i + 1].z);
                    simulatedTime += (currentVertice.distanceTo(nextVertice) / AVERAGE_CAR_SPEED);
                }
            }
        }

        return simulatedTime;
    }

    private simulatePartialSegmentTime(currentSegmentIndex: number, position: Vector3): number {
        const nextTrackVertex: Vector3 = new Vector3(
            this._chosenTrack.vertices[currentSegmentIndex].x,
            0,
            this._chosenTrack.vertices[currentSegmentIndex].z
        );

        return (position.distanceTo(nextTrackVertex) / AVERAGE_CAR_SPEED);
    }

}
