import { State } from "./state";
import { RacingGame } from "../race-game/racingGame";
import { EndGameTableService } from "../scoreboard/end-game-table/end-game-table.service";
// import { AICarService } from "../artificial-intelligence/ai-car.service";
// import { SoundManagerService } from "../sound-service/sound-manager.service";
// import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";

export class ClosingState implements State {

    public constructor(
        private _endGameTableService: EndGameTableService
        // private _aiCarService: AICarService,
        // private _gameTimeManager: GameTimeManagerService,
        // private _soundManager: SoundManagerService
    ) { }

    public init(): void {
        this._endGameTableService.showTable = true;
    }

    public update(racingGame: RacingGame): void {
        this._endGameTableService.setPlayers(racingGame.players);
    }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(racingGame: RacingGame): void { }
}
