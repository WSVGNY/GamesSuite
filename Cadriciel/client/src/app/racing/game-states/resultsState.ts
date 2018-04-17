import { State } from "./state";
import { RacingGame } from "../race-game/racingGame";
import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";
import { StateTypes } from "./stateTypes";
import { CarTrackingManagerService } from "../carTracking-manager/car-tracking-manager.service";
import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";
import { SoundManagerService } from "../sound-service/sound-manager.service";

export class ResultsState implements State {

    public constructor(
        private _trackingManager: CarTrackingManagerService,
        private _gameTimeManager: GameTimeManagerService,
        private _soundManager: SoundManagerService
    ) { }

    public init(): void { }

    public update(gameUpdateManager: GameUpdateManagerService, racingGame: RacingGame): void {
        for (const car of racingGame.cars) {
            if (!car.raceProgressTracker.isRaceCompleted && !car.raceProgressTracker.isTimeLogged) {
                racingGame.getPlayerById(car.uniqueid).setTotalTime(
                    this._gameTimeManager.simulateRaceTime(car.raceProgressTracker, car.currentPosition, racingGame.track)
                );
                car.raceProgressTracker.isTimeLogged = true;
            }
        }
        this.advanceToNextState(gameUpdateManager);
    }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(gameUpdateManager: GameUpdateManagerService): void {
        gameUpdateManager.setState(StateTypes.Closing);
    }
}
