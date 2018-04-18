import { State } from "./state";
import { StateTypes } from "./stateTypes";

export class ResultsState extends State {

    public init(): void { }

    public update(): void {
        for (const car of this._racingGame.cars) {
            if (car.raceProgressTracker.lapCount <= 3) {
                console.log(car.raceProgressTracker.currentSegmentIndex);
                this._racingGame.getPlayerByUniqueId(car.uniqueid).pushLapTime(
                    this._serviceLoader.gameTimeService.simulateRaceTime(
                        car.raceProgressTracker,
                        car.currentPosition,
                        this._racingGame.gameScene.trackMesh.trackPoints.toVectors3
                    )
                );
                car.raceProgressTracker.isTimeLogged = true;
            }
            console.log(this._racingGame.getPlayerByUniqueId(car.uniqueid).score.lapTimes);
        }
        this.advanceToNextState();
    }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(): void {
        this._racingGame.setState(StateTypes.ResultsTable);
    }
}
