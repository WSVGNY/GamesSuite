import { State } from "./state";
import { StateType } from "./stateTypes";

export class HighscoreState extends State {

    public initialize(): void {
        this._serviceLoader.highscoreService.highscores = this._racingGame.track.bestTimes;
        if (this._serviceLoader.highscoreService.isNewHighScore(this._racingGame.getPlayerByUniqueId(0))) {
            this._serviceLoader.inputTimeService.showInput = true;
        }
    }

    public update(): void {
        if (!this._serviceLoader.inputTimeService.showInput) {
            this._racingGame.track.bestTimes = this._serviceLoader.highscoreService.highscores;
            this._serviceLoader.highscoreService.showTable = true;
            this._serviceLoader.trackService.putTrack(this._racingGame.track.id, this._racingGame.track).subscribe();
            if (this.isStateOver()) {
                this.advanceToNextState();
            }
        }
    }

    protected isStateOver(): boolean {
        return true;
    }

    protected advanceToNextState(): void {
        this._racingGame.setState(StateType.Standby);
    }
}
