import { State } from "./state";

export class HighscoreState extends State {

    public init(): void {
        if (this._serviceLoader.highscoreService.isNewHighScore(this._racingGame.getPlayerById(0))) {
            this._serviceLoader.inputTimeService.showInput = true;
        }
    }

    public update(): void {
        if (!this._serviceLoader.inputTimeService.showInput) {
            this._serviceLoader.highscoreService.showTable = true;
        }
    }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(): void { }
}
