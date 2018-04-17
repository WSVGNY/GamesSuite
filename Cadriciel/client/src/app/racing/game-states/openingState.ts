import { State } from "./state";
import { RacingGame } from "../race-game/racingGame";
import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";
import { StateTypes } from "./stateTypes";
import { CameraManagerService } from "../cameras/camera-manager.service";
import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";
// import { SoundManagerService } from "../sound-service/sound-manager.service";

const MINIMUM_CAR_TO_CAMERA_DISTANCE: number = 3;

export class OpeningState implements State {

    public constructor(
        private _cameraManager: CameraManagerService,
        private _gameTimeManager: GameTimeManagerService,
        // private _soundManager: SoundManagerService
    ) { }

    public init(racingGame?: RacingGame): void {
        this._cameraManager.initializeSpectatingCameraPosition(racingGame.playerCar.currentPosition, racingGame.playerCar.direction);
        // this._soundManager.bindSoundKeys();
    }

    public update(gameUpdateManager: GameUpdateManagerService, racingGame: RacingGame): void {
        this._cameraManager.updateCameraPositions(racingGame.playerCarPosition, this._gameTimeManager.getElaspedTime());
        if (this.isStateOver()) {
            this.advanceToNextState(gameUpdateManager);
        }
    }

    public isStateOver(racingGame?: RacingGame): boolean {
        if (racingGame === undefined) {
            throw ReferenceError("Expected racingGame parameter");
        }

        return this._cameraManager.spectatingCamera.position.clone()
            .distanceTo(racingGame.playerCarPosition) < MINIMUM_CAR_TO_CAMERA_DISTANCE;
    }

    public advanceToNextState(gameUpdateManager: GameUpdateManagerService): void {
        gameUpdateManager.setState(StateTypes.Countdown);
        this._gameTimeManager.resetStartDate();
        this._cameraManager.changeToThirdPersonCamera();
        // this._countDownOnScreenValue = "3";
        // this._soundManager.playCurrentStartSequenceSound();
    }
}
