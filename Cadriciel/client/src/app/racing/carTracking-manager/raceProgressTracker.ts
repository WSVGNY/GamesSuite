export class RaceProgressTracker {

    private _currentSegmentIndex: number;
    private _segmentCounted: number;
    private _lapCount: number;

    public isTimeLogged: boolean;
    public isRaceCompleted: boolean;
    public isLapCompleted: boolean;

    public constructor() {
        this._currentSegmentIndex = 1;
        this._segmentCounted = 0;
        this._lapCount = 1;
        this.isRaceCompleted = false;
        this.isLapCompleted = false;
        this.isTimeLogged = false;
    }

    public incrementIndexCount(): void {
        this._segmentCounted++;
    }

    public resetCurrentSegmentIndex(lapSize: number): void {
        this._currentSegmentIndex = 1;
        this._segmentCounted = (this._lapCount - 1) * lapSize;
    }

    public get segmentCounted(): number {
        return this._segmentCounted;
    }

    public incrementLapCount(): void {
        this._lapCount++;
    }

    public get lapCount(): number {
        return this._lapCount;
    }

    public incrementCurrentIndex(indexQuantity: number): void {
        this._currentSegmentIndex++;
        this._currentSegmentIndex %= indexQuantity;
    }

    public get currentSegmentIndex(): number {
        return this._currentSegmentIndex;
    }
}
