import { State } from "./state";
import { StateType } from "./stateTypes";
import { MINIMUM_CAR_TO_CAMERA_DISTANCE } from "../constants/camera.constants";

export class OpeningState extends State {

    public initialize(): void {
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

    protected isStateOver(): boolean {
        return this._serviceLoader.cameraService.spectatingCamera.position.clone()
            .distanceTo(this._racingGame.playerCarPosition) < MINIMUM_CAR_TO_CAMERA_DISTANCE;
    }

    protected advanceToNextState(): void {
        this._racingGame.setState(StateType.Countdown);
        this._serviceLoader.cameraService.changeToThirdPersonCamera();
    }
}
