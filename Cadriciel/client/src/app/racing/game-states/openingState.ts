import { State } from "./state";
import { AbstractState } from "./abstractState";
import { RacingGame } from "../race-game/racingGame";
import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";

const MINIMUM_CAR_TO_CAMERA_DISTANCE: number = 3;

export class OpeningState extends AbstractState implements State {

    public update(gameUpdateManager: GameUpdateManagerService, racingGame: RacingGame): void {
        this._cameraManager.updateCameraPositions(racingGame.playerCarPosition, this._gameTimeManager.elaspedTime);
        if (this.isAnimationOver(racingGame)) {
            this.advanceToNextState(gameUpdateManager);
        }
    }

    private isAnimationOver(racingGame: RacingGame): boolean {
        return this._cameraManager.spectatingCamera.position.clone()
            .distanceTo(racingGame.playerCarPosition) < MINIMUM_CAR_TO_CAMERA_DISTANCE;
    }

    private advanceToNextState(gameUpdateManager: GameUpdateManagerService): void {
        gameUpdateManager.setState("COUNTDOWN");
        this._gameTimeManager.resetStartDate();
        this._cameraManager.changeToThirdPersonCamera();
        // this._countDownOnScreenValue = "3";
        // this._soundManager.playCurrentStartSequenceSound();
    }
}
