import { State } from "./state";
import { AbstractState } from "./abstractState";
import { RacingGame } from "../race-game/racingGame";
import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";

export class RacingState extends AbstractState implements State {

    public init(): void { }

    public update(gameUpdateManager: GameUpdateManagerService, racingGame: RacingGame): void {
        this.updateCars(racingGame, this._gameTimeManager.getTimeSinceLastFrame());
        this._collisionManager.update(racingGame.cars);
        this._cameraManager.updateCameraPositions(racingGame.playerCarPosition);
    }

    private updateCars(racingGame: RacingGame, timeSinceLastFrame: number): void {
        for (let i: number = 0; i < racingGame.cars.length; ++i) {
            racingGame.cars[i].update(timeSinceLastFrame);
            // const donePlayer: Player = this._players.find((player: Player) => player.id === this._cars[i].uniqueid);
            // if (racingGame.cars[i] instanceof AICar) {
            //     this._aiCarService.update(this._cars[i] as AICar, this._carDebugs[i]);
            //     if (this._trackingManager.update(this._cars[i].currentPosition, this._cars[i].raceProgressTracker)) {
            //         donePlayer.setTotalTime((Date.now() - this._startDate) * MS_TO_SEC);
            //         this._cars[i].raceProgressTracker.isTimeLogged = true;
            //     }
            // } else {
            //     if (this._trackingManager.update(this._cars[i].currentPosition, this._cars[i].raceProgressTracker)) {
            //         donePlayer.setTotalTime((Date.now() - this._startDate) * MS_TO_SEC);
            //         this._cars[i].raceProgressTracker.isTimeLogged = true;
            //         this._currentState = State.END;
            //     }
            // }
        }
    }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(): void { }
}
