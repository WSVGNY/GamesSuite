import { State } from "./state";
import { AbstractState } from "./abstractState";
import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";
import { RacingGame } from "../race-game/racingGame";

export class CountdowngState extends AbstractState implements State {

    public update(gameUpdateManager: GameUpdateManagerService, racingGame: RacingGame): void {
        let countdownValue: number = +racingGame.countdownOnScreenValue;
        racingGame.countdownOnScreenValue = (--countdownValue).toString();
        if (this.isCountDownOver(countdownValue)) {
            racingGame.isCountdownOver = true;
            racingGame.countdownOnScreenValue = "START";
            this.advanceToNextState(gameUpdateManager);
        }
    }

    private isCountDownOver(countdownValue: number): boolean {
        return countdownValue === 0;
    }

    private advanceToNextState(gameUpdateManager: GameUpdateManagerService): void {
        gameUpdateManager.setState("RACING");
        this._gameTimeManager.resetStartDate();
        // this._startDate = Date.now();
    }
}
