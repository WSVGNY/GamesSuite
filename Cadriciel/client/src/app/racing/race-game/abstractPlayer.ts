import { Car } from "../car/car";
import { CommonScore } from "../../../../../common/racing/commonScore";
import { RaceProgressTracker } from "../carTracking-manager/raceProgressTracker";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";

export abstract class AbstractPlayer {

    private _id: number;
    private _raceProgressTracker: RaceProgressTracker;
    private _score: CommonScore;

    protected _car: Car;

    public constructor(id: number, keyboardHandler: KeyboardEventHandlerService) {
        this._id = id;
        this._raceProgressTracker = new RaceProgressTracker();
        this.initializeCar(keyboardHandler);
    }

    protected abstract initializeCar(keyboardHandler: KeyboardEventHandlerService): void;

    public get car(): Car {
        return this._car;
    }

    public update(): void {
        
    }

}
