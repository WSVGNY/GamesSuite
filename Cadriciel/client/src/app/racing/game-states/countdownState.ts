import { State } from "./state";
import { RacingGame } from "../race-game/racingGame";
import { StateTypes } from "./stateTypes";
import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";
import { CountdownService } from "../countdown/countdown.service";
import { SoundManagerService } from "../sound-service/sound-manager.service";

const ONE_SECOND: number = 1000;
const STARTING_TEXT: string = "START";

export class CountdownState implements State {

    public constructor(
        private _gameTimeManager: GameTimeManagerService,
        private _countdownService: CountdownService,
        private _soundManager: SoundManagerService
    ) { }

    public init(): void {
        this._gameTimeManager.resetStartDate();
        this._countdownService.initialize();
        this._soundManager.playCurrentStartSequenceSound();
    }

    public update(racingGame: RacingGame): void {
        if (this._gameTimeManager.getElaspedTime() > ONE_SECOND) {
            this._gameTimeManager.resetStartDate();
            this._countdownService.decreaseOnScreenValue();
            this._soundManager.playCurrentStartSequenceSound();
        }
        if (this.isStateOver()) {
            this._countdownService.isCountdownOver = true;
            this._countdownService.onScreenValue = STARTING_TEXT;
            this.advanceToNextState(racingGame);
        }
    }

    public isStateOver(): boolean {
        return +this._countdownService.onScreenValue === 0;
    }

    public advanceToNextState(racingGame: RacingGame): void {
        racingGame.setState(StateTypes.Racing);
        this._gameTimeManager.resetStartDate();
    }
}
