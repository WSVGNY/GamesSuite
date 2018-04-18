import { PerspectiveCamera } from "three";
import {
    GAME_FIELD_OF_VIEW,
    NEAR_CLIPPING_PLANE,
    FAR_CLIPPING_PLANE,
    PLAYER_CAMERA_NAME,
    INITIAL_PLAYER_CAMERA_POSITION_Y,
    INITIAL_PLAYER_CAMERA_POSITION_Z
} from "../constants/camera.constants";

export class ThirdPersonCamera extends PerspectiveCamera {

    public constructor(aspectRatio: number) {
        super(GAME_FIELD_OF_VIEW, aspectRatio, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
        this.name = PLAYER_CAMERA_NAME;
        this.position.z = INITIAL_PLAYER_CAMERA_POSITION_Z;
        this.position.y = INITIAL_PLAYER_CAMERA_POSITION_Y;
    }

    public onResize(): void {
        this.updateProjectionMatrix();
    }
}
