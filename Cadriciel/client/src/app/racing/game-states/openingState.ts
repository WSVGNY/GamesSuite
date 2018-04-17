import { State } from "./state";
import { RacingGame } from "../race-game/racingGame";
import { StateTypes } from "./stateTypes";
import { CameraManagerService } from "../cameras/camera-manager.service";
import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";
import { SoundManagerService } from "../sound-service/sound-manager.service";

const MINIMUM_CAR_TO_CAMERA_DISTANCE: number = 3;

export class OpeningState implements State {

    public constructor(
        private _cameraManager: CameraManagerService,
        private _gameTimeManager: GameTimeManagerService,
        private _soundManager: SoundManagerService
    ) { }

    public init(): void {
        this._cameraManager.changeToSpectatingCamera();
        this._gameTimeManager.resetStartDate();
        this._soundManager.bindSoundKeys();
        this._soundManager.playAccelerationSound();
    }

    public update(racingGame: RacingGame): void {
        this._cameraManager.updateCameraPositions(racingGame.playerCarPosition, this._gameTimeManager.getElaspedTime());
        if (this.isStateOver(racingGame)) {
            this.advanceToNextState(racingGame);
        }
    }

    public isStateOver(racingGame?: RacingGame): boolean {
        if (racingGame === undefined) {
            throw ReferenceError("Expected racingGame parameter");
        }

        return this._cameraManager.spectatingCamera.position.clone()
            .distanceTo(racingGame.playerCarPosition) < MINIMUM_CAR_TO_CAMERA_DISTANCE;
    }

    public advanceToNextState(racingGame: RacingGame): void {
        racingGame.setState(StateTypes.Countdown);
        this._cameraManager.changeToThirdPersonCamera();
    }
}
