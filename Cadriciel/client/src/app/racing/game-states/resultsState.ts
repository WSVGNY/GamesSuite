import { State } from "./state";
import { StateTypes } from "./stateTypes";

export class ResultsState extends State {

    public init(): void { }

    public update(): void {
        for (const car of this._racingGame.cars) {
            if (!car.raceProgressTracker.isRaceCompleted && !car.raceProgressTracker.isTimeLogged) {
                this._racingGame.getPlayerById(car.uniqueid).setTotalTime(
                    this._serviceLoader.gameTimeService.simulateRaceTime(
                        car.raceProgressTracker, car.currentPosition,
                        this._racingGame.track
                    )
                );
                car.raceProgressTracker.isTimeLogged = true;
            }
        }
        this.advanceToNextState();
    }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(): void {
        this._racingGame.setState(StateTypes.Closing);
    }
}
