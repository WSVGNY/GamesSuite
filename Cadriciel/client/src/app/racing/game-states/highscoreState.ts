import { State } from "./state";

export class HighscoreState extends State {

    public init(): void {
        this._serviceLoader.highscoreService.highscores = this._racingGame.track.bestTimes;
        if (this._serviceLoader.highscoreService.isNewHighScore(this._racingGame.getPlayerById(0))) {
            this._serviceLoader.inputTimeService.showInput = true;
        }
    }

    public update(): void {
        if (!this._serviceLoader.inputTimeService.showInput) {
            this._racingGame.track.bestTimes = this._serviceLoader.highscoreService.highscores;
            this._serviceLoader.highscoreService.showTable = true;
            this._serviceLoader.trackService.putTrack(this._racingGame.track.id, this._racingGame.track).subscribe();
        }

    }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(): void { }
}
