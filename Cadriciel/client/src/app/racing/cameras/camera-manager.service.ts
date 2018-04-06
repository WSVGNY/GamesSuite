import { Injectable } from "@angular/core";
import { ThirdPersonCamera } from "./thirdPersonCamera";
import { TopViewCamera } from "./topViewCamera";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { Car } from "../car/car";
import { CHANGE_CAMERA_KEYCODE } from "../constants";
import { Camera } from "three";

@Injectable()
export class CameraManagerService {
    private _thirdPersonCamera: ThirdPersonCamera;
    private _topViewCamera: TopViewCamera;
    private _useThirdPersonCamera: boolean;

    public constructor(
        private _keyBoardHandler: KeyboardEventHandlerService
    ) {
        this._useThirdPersonCamera = true;
    }

    public initializeCameras(aspectRatio: number): void {
        this._thirdPersonCamera = new ThirdPersonCamera(aspectRatio);
        this._topViewCamera = new TopViewCamera(aspectRatio);
    }

    public getCurrentCamera(): Camera {
        return this._useThirdPersonCamera ? this._thirdPersonCamera : this._topViewCamera;
    }

    public bindCameraKey(): void {
        this._keyBoardHandler.bindFunctionToKeyDown(CHANGE_CAMERA_KEYCODE, () =>
            this._useThirdPersonCamera = !this._useThirdPersonCamera);
    }

    public updateCameraPositions(playerCar: Car): void {
        this._topViewCamera.updatePosition(playerCar);
    }

}
