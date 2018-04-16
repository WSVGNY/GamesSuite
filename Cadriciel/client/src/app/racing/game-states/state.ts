import { RacingGame } from "../race-game/racingGame";
import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";

export interface State {
    update(gameUpdateManager: GameUpdateManagerService, racingGame: RacingGame): void;
    isStateOver(): boolean;
    advanceToNextState(gameUpdateManager: GameUpdateManagerService): void;
    init(): void;
}
