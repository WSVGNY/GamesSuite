import { State } from "./state";
import { AbstractState } from "./abstractState";
import { RacingGame } from "../race-game/racingGame";
import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";
import { AICar } from "../car/aiCar";
import { Player } from "../race-game/player";
import { States } from "./states";

const MS_TO_SEC: number = 0.001;

export class RacingState extends AbstractState implements State {

    public init(): void { }

    public update(gameUpdateManager: GameUpdateManagerService, racingGame: RacingGame): void {
        if (this.updateCars(racingGame, this._gameTimeManager.getTimeSinceLastFrame())) {
            this.advanceToNextState(gameUpdateManager);
        }
        this._collisionManager.update(racingGame.cars);
        this._cameraManager.updateCameraPositions(racingGame.playerCarPosition);
    }

    private updateCars(racingGame: RacingGame, timeSinceLastFrame: number): boolean {
        for (let i: number = 0; i < racingGame.cars.length; ++i) {
            racingGame.cars[i].update(timeSinceLastFrame);
            const donePlayer: Player = racingGame.players.find((player: Player) => player.id === racingGame.cars[i].uniqueid);
            if (racingGame.cars[i] instanceof AICar) {
                this._aiCarService.update(racingGame.cars[i] as AICar, racingGame.aiCarDebugs[i]);
                if (this._trackingManager.update(racingGame.cars[i].currentPosition, racingGame.cars[i].raceProgressTracker)) {
                    donePlayer.setTotalTime(this._gameTimeManager.getElaspedTime() * MS_TO_SEC);
                    racingGame.cars[i].raceProgressTracker.isTimeLogged = true;
                }
            } else {
                if (this._trackingManager.update(racingGame.cars[i].currentPosition, racingGame.cars[i].raceProgressTracker)) {
                    donePlayer.setTotalTime(this._gameTimeManager.getElaspedTime() * MS_TO_SEC);
                    racingGame.cars[i].raceProgressTracker.isTimeLogged = true;

                    return true;
                }
            }
        }

        return false;
    }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(gameUpdateManager: GameUpdateManagerService): void {
        gameUpdateManager.setState(States.Results);
    }
}
