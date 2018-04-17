import { State } from "./state";
import { RacingGame } from "../race-game/racingGame";
// import { AICarService } from "../artificial-intelligence/ai-car.service";
// import { SoundManagerService } from "../sound-service/sound-manager.service";
// import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";

export class ClosingState implements State {

    public constructor(
        // private _aiCarService: AICarService,
        // private _gameTimeManager: GameTimeManagerService,
        // private _soundManager: SoundManagerService
    ) { }

    public init(): void { }

    public update(racingGame: RacingGame): void { }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(racingGame: RacingGame): void { }
}
