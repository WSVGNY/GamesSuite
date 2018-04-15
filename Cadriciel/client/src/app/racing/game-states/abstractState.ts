import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";
import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";

export abstract class AbstractState {

    public constructor(
        protected gameUpdateManager: GameUpdateManagerService,
        protected gameTimeManager: GameTimeManagerService
    ) { }
}
