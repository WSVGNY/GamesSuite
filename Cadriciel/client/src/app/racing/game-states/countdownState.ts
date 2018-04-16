import { State } from "./state";
import { AbstractState } from "./abstractState";
import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";
import { RacingGame } from "../race-game/racingGame";
import { States } from "./states";

export class CountdownState extends AbstractState implements State {

    private _countdownValue: number;

    public init(): void {
        this._countdownValue = 0;
    }

    public update(gameUpdateManager: GameUpdateManagerService, racingGame: RacingGame): void {
        this._countdownValue = +racingGame.countdownOnScreenValue;
        racingGame.countdownOnScreenValue = (--this._countdownValue).toString();
        if (this.isStateOver()) {
            racingGame.isCountdownOver = true;
            racingGame.countdownOnScreenValue = "START";
            this.advanceToNextState(gameUpdateManager);
        }
    }

    public isStateOver(): boolean {
        return this._countdownValue === 0;
    }

    public advanceToNextState(gameUpdateManager: GameUpdateManagerService): void {
        gameUpdateManager.setState(States.Racing);
        this._gameTimeManager.resetStartDate();
        // this._startDate = Date.now();
    }
}
