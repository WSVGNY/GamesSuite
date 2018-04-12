import { PerspectiveCamera } from "three";
import { GAME_FIELD_OF_VIEW, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE } from "../constants/camera.constants";

export class ThirdPersonCamera extends PerspectiveCamera {

    private readonly INITIAL_CAMERA_POSITION_Z: number = 5;
    private readonly INITIAL_CAMERA_POSITION_Y: number = 2.5;

    public constructor(aspectRatio: number) {
        super(GAME_FIELD_OF_VIEW, aspectRatio, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
        this.name = "PLAYER_CAMERA";
        this.position.z = this.INITIAL_CAMERA_POSITION_Z;
        this.position.y = this.INITIAL_CAMERA_POSITION_Y;
    }

    public onResize(): void {
        this.updateProjectionMatrix();
    }
}
