import { State } from "./state";
import { AbstractState } from "./abstractState";
import { RacingGame } from "../race-game/racingGame";
import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";
import { States } from "./states";

export class ResultsState extends AbstractState implements State {

    public init(): void { }

    public update(gameUpdateManager: GameUpdateManagerService, racingGame: RacingGame): void {
        for (const car of racingGame.cars) {
            if (!car.raceProgressTracker.isRaceCompleted && !car.raceProgressTracker.isTimeLogged) {
                racingGame.getPlayerById(car.uniqueid).setTotalTime(
                    this._gameTimeManager.simulateRaceTime(car.raceProgressTracker, car.currentPosition, racingGame.track)
                );
                car.raceProgressTracker.isTimeLogged = true;
            }
        }
        this.advanceToNextState(gameUpdateManager);
    }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(gameUpdateManager: GameUpdateManagerService): void {
        gameUpdateManager.setState(States.Closing);
    }
}
