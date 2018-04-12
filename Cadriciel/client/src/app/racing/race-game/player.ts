import { Car } from "../car/car";
import { CommonScore } from "../../../../../common/racing/commonScore";
import { RaceProgressTracker } from "../carTracking-manager/raceProgressTracker";

export class Player {
    private _id: number;
    private _car: Car;
    private _score: CommonScore;
    private _raceProgressTracker: RaceProgressTracker;

    public constructor() { }
}
