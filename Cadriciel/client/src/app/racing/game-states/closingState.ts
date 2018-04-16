import { State } from "./state";
import { AbstractState } from "./abstractState";
import { RacingGame } from "../race-game/racingGame";
import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";

export class ClosingState extends AbstractState implements State {

    public init(): void { }

    public update(gameUpdateManager: GameUpdateManagerService, racingGame: RacingGame): void {

    }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(): void { }
}
