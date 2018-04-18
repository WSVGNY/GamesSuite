import { State } from "./state";
import { StateTypes } from "./stateTypes";

const ONE_SECOND: number = 1000;
const STARTING_TEXT: string = "START";

export class CountdownState extends State {

    public init(): void {
        this._serviceLoader.gameTimeService.resetStartDate();
        this._serviceLoader.countdownService.initialize();
        this._serviceLoader.soundService.playCurrentStartSequenceSound();
    }

    public update(): void {
        if (this._serviceLoader.gameTimeService.getElaspedTime() > ONE_SECOND) {
            this._serviceLoader.gameTimeService.resetStartDate();
            this._serviceLoader.countdownService.decreaseOnScreenValue();
            this._serviceLoader.soundService.playCurrentStartSequenceSound();
        }
        if (this.isStateOver()) {
            this._serviceLoader.countdownService.onScreenValue = STARTING_TEXT;
            this._serviceLoader.countdownService.isCountdownOver = true;
            this.advanceToNextState();
        }
    }

    public isStateOver(): boolean {
        return +this._serviceLoader.countdownService.onScreenValue === 0;
    }

    public advanceToNextState(): void {
        this._racingGame.setState(StateTypes.Racing);
        this._serviceLoader.gameTimeService.resetStartDate();
    }
}
