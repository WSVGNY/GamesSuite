import { TestBed, inject } from "@angular/core/testing";

import { CameraManagerService } from "./camera-manager.service";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { Camera } from "three";
import { CHANGE_CAMERA_KEYCODE } from "../constants";

describe("CameraManagerService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CameraManagerService, KeyboardEventHandlerService]
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
            cameraManager.bindCameraKey();
            const oldCamera: Camera = cameraManager.getCurrentCamera();
            keyboardManager.handleKeyDown(CHANGE_CAMERA_KEYCODE);

            expect(oldCamera).not.toEqual(cameraManager.getCurrentCamera());
        }
    ));
});
