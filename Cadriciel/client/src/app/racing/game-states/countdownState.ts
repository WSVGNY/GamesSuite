import { State } from "./state";
import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";
import { RacingGame } from "../race-game/racingGame";
import { StateTypes } from "./stateTypes";
import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";
// import { SoundManagerService } from "../sound-service/sound-manager.service";

export class CountdownState implements State {

    private _countdownValue: number;

    public constructor(
        private _gameTimeManager: GameTimeManagerService,
        // private _soundManager: SoundManagerService
    ) { }

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
        gameUpdateManager.setState(StateTypes.Racing);
        this._gameTimeManager.resetStartDate();
        // this._startDate = Date.now();
    }
}
