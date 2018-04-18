import { State } from "./state";
import { StateTypes } from "./stateTypes";

const MINIMUM_CAR_TO_CAMERA_DISTANCE: number = 3;

export class OpeningState extends State {

    public init(): void {
        this._serviceLoader.cameraService.changeToSpectatingCamera();
        this._serviceLoader.gameTimeService.resetStartDate();
        this._serviceLoader.soundService.bindSoundKeys();
        this._serviceLoader.soundService.playAccelerationSound();
    }

    public update(): void {
        this._serviceLoader.cameraService.updateCameraPositions(
            this._racingGame.playerCarPosition,
            this._serviceLoader.gameTimeService.getElaspedTime()
        );
        if (this.isStateOver()) {
            this.advanceToNextState();
        }
    }

    public isStateOver(): boolean {
        return this._serviceLoader.cameraService.spectatingCamera.position.clone()
            .distanceTo(this._racingGame.playerCarPosition) < MINIMUM_CAR_TO_CAMERA_DISTANCE;
    }

    public advanceToNextState(): void {
        this._racingGame.setState(StateTypes.Countdown);
        this._serviceLoader.cameraService.changeToThirdPersonCamera();
    }
}
