import { State } from "./state";
import { RacingGame } from "../race-game/racingGame";
import { EndGameTableService } from "../scoreboard/end-game-table/end-game-table.service";
import { HighscoreService } from "../scoreboard/best-times/highscore.service";
import { TrackService } from "../track/track-service/track.service";
// import { AICarService } from "../artificial-intelligence/ai-car.service";
// import { SoundManagerService } from "../sound-service/sound-manager.service";
// import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";

export class ClosingState implements State {

    private _uploadTrack: boolean;

    public constructor(
        private _endGameTableService: EndGameTableService,
        private _highscoreService: HighscoreService,
        private _trackService: TrackService
        // private _aiCarService: AICarService,
        // private _gameTimeManager: GameTimeManagerService,
        // private _soundManager: SoundManagerService
    ) {
        this._uploadTrack = true;
    }

    public init(): void {
        this._endGameTableService.showTable = true;
    }

    public update(racingGame: RacingGame): void {
        this._endGameTableService.setPlayers(racingGame.players);
        if (this._highscoreService.highscores.length === 0) {
            this._highscoreService.highscores = racingGame.track.bestTimes;
        }
        if (this._highscoreService.showTable && this._uploadTrack) {
            this._uploadTrack = false;
            racingGame.track.bestTimes = this._highscoreService.highscores;
            this._trackService.putTrack(racingGame.track.id, racingGame.track).subscribe();
        }
    }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(racingGame: RacingGame): void { }
}
