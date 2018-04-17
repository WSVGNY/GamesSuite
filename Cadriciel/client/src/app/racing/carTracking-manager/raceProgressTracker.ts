export class RaceProgressTracker {

    private _currentSegmentIndex: number;
    private _segmentCounted: number;

    public isTimeLogged: boolean;
    public isRaceCompleted: boolean;

    public constructor() {
        this._currentSegmentIndex = 1;
        this._segmentCounted = 0;
        this.isRaceCompleted = false;
        this.isTimeLogged = false;
    }

    public incrementIndexCount(): void {
        this._segmentCounted++;
    }

    public resetCurrentSegmentIndex(): void {
        this._currentSegmentIndex = 1;
    }

    public get segmentCounted(): number {
        return this._segmentCounted;
    }

    public incrementCurrentIndex(indexQuantity: number): void {
        this._currentSegmentIndex++;
        this._currentSegmentIndex %= indexQuantity;
    }

    public get currentSegmentIndex(): number {
        return this._currentSegmentIndex;
    }
}
