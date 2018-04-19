import { State } from "./state";
import { StateType } from "./stateTypes";
import { ONE_SECOND, STARTING_TEXT } from "../constants/scene.constants";

export class CountdownState extends State {

    public initialize(): void {
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

    protected isStateOver(): boolean {
        return +this._serviceLoader.countdownService.onScreenValue === 0;
    }

    protected advanceToNextState(): void {
        this._racingGame.setState(StateType.Racing);
        this._serviceLoader.gameTimeService.resetStartDate();
    }
}
