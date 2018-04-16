import { State } from "./state";
import { AbstractState } from "./abstractState";
import { RacingGame } from "../race-game/racingGame";
import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";
import { States } from "./states";

const MINIMUM_CAR_TO_CAMERA_DISTANCE: number = 3;

export class OpeningState extends AbstractState implements State {

    public init(): void { }

    public update(gameUpdateManager: GameUpdateManagerService, racingGame: RacingGame): void {
        this._cameraManager.updateCameraPositions(racingGame.playerCarPosition, this._gameTimeManager.elaspedTime);
        if (this.isStateOver()) {
            this.advanceToNextState(gameUpdateManager);
        }
    }

    public isStateOver(racingGame?: RacingGame): boolean {
        if (racingGame === undefined) {
            return false;
        }

        return this._cameraManager.spectatingCamera.position.clone()
            .distanceTo(racingGame.playerCarPosition) < MINIMUM_CAR_TO_CAMERA_DISTANCE;
    }

    public advanceToNextState(gameUpdateManager: GameUpdateManagerService): void {
        gameUpdateManager.setState(States.Countdown);
        this._gameTimeManager.resetStartDate();
        this._cameraManager.changeToThirdPersonCamera();
        // this._countDownOnScreenValue = "3";
        // this._soundManager.playCurrentStartSequenceSound();
    }
}
