import { TestBed, inject } from "@angular/core/testing";
import { CameraManagerService } from "./camera-manager.service";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { Camera } from "three";
import { CHANGE_CAMERA_KEYCODE } from "../constants/keycode.constants";
import { InputTimeService } from "../scoreboard/input-time/input-time.service";

describe("CameraManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [KeyboardEventHandlerService, CameraManagerService, InputTimeService]
        }).compileComponents()
            .then()
            .catch((e: Error) => console.error(e.message));
    });

    it("should be created", inject([CameraManagerService], (service: CameraManagerService) => {
        expect(service).toBeTruthy();
    }));

    it("should switch between cameras", inject(
        [CameraManagerService, KeyboardEventHandlerService],
        (cameraManager: CameraManagerService, keyboardManager: KeyboardEventHandlerService) => {
            cameraManager.initializeCameras(1);
            keyboardManager.initialize();
            cameraManager.bindCameraKey();
            const oldCamera: Camera = cameraManager.currentCamera;
            keyboardManager.handleKeyDown(CHANGE_CAMERA_KEYCODE);

            expect(oldCamera).not.toEqual(cameraManager.currentCamera);
        }
    ));
});
