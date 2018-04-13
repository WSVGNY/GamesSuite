import { Injectable } from "@angular/core";

@Injectable()
export class GameTimeManagerService {

    private _lastFrameDate: number;
    private _raceStartDate: number;

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

}
