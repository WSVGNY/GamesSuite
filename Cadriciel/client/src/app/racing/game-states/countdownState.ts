import { State } from "./state";
import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";
import { RacingGame } from "../race-game/racingGame";
import { StateTypes } from "./stateTypes";
import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";
import { CountdownService } from "../countdown/countdown.service";
// import { SoundManagerService } from "../sound-service/sound-manager.service";

const ONE_SECOND: number = 1000;

export class CountdownState implements State {

    public constructor(
        private _gameTimeManager: GameTimeManagerService,
        private _countdownService: CountdownService
        // private _soundManager: SoundManagerService
    ) { }

    public init(): void {
        this._gameTimeManager.resetStartDate();
        this._countdownService.initialize();
    }

    public update(gameUpdateManager: GameUpdateManagerService, racingGame: RacingGame): void {
        if (this._gameTimeManager.getElaspedTime() > ONE_SECOND) {
            this._gameTimeManager.resetStartDate();
            this._countdownService.decreaseOnScreenValue();
        }
        if (this.isStateOver()) {
            racingGame.isCountdownOver = true;
            racingGame.countdownOnScreenValue = "START";
            this.advanceToNextState(gameUpdateManager);
        }
    }

    public isStateOver(): boolean {
        return +this._countdownService.onScreenValue === 0;
    }

    public advanceToNextState(gameUpdateManager: GameUpdateManagerService): void {
        console.log("countdown over");
        gameUpdateManager.setState(StateTypes.Racing);
        this._gameTimeManager.resetStartDate();
        // this._startDate = Date.now();
    }
}
