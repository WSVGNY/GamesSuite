import { State } from "./state";
import { AbstractState } from "./abstractState";
import { RacingGame } from "../race-game/racingGame";

const MINIMUM_CAR_TO_CAMERA_DISTANCE: number = 3;
export class OpeningState extends AbstractState implements State {

    public update(racingGame: RacingGame): void {
        racingGame.updateCamera(racingGame.playerCarPosition, this.gameTimeManager.elaspedTime);
        if (this.isAnimationOver(racingGame)) {
            this.advanceToNextState(racingGame);
        }
    }

    private isAnimationOver(racingGame: RacingGame): boolean {
        return racingGame.currentCamera.position.clone().distanceTo(racingGame.playerCarPosition) < MINIMUM_CAR_TO_CAMERA_DISTANCE;
    }

    private advanceToNextState(racingGame: RacingGame): void {
        this.gameTimeManager.resetStartDate();
        // this._countDownOnScreenValue = "3";
        this._currentState = State.COUNTDOWN;
        this._cameraManager.changeToThirdPersonCamera();
        this._soundManager.playCurrentStartSequenceSound();
    }
}
