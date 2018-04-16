import { State } from "./state";
import { AbstractState } from "./abstractState";
import { RacingGame } from "../race-game/racingGame";
import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";

export class ResultsState extends AbstractState implements State {

    public update(gameUpdateManager: GameUpdateManagerService, racingGame: RacingGame): void {
        for (const car of racingGame.cars) {
            if (!car.raceProgressTracker.isRaceCompleted && !car.raceProgressTracker.isTimeLogged) {
                racingGame.getPlayerById(car.uniqueid).setTotalTime(
                    this._gameTimeManager.elaspedTime +
                    this._gameTimeManager.simulateRaceTime(
                        car.raceProgressTracker,
                        car.currentPosition,
                        racingGame.track
                    )
                );
                car.raceProgressTracker.isTimeLogged = true;
            }
        }
    }

    public advanceToNextState(gameUpdateManager: GameUpdateManagerService): void {

    }
}
