import { PerspectiveCamera } from "three";

const NEAR_CLIPPING_PLANE: number = 1;
const FAR_CLIPPING_PLANE: number = 1000;
const FIELD_OF_VIEW: number = 70;

const INITIAL_CAMERA_POSITION_Z: number = 10;
const INITIAL_CAMERA_POSITION_Y: number = 5;

export class ThirdPersonCamera extends PerspectiveCamera {

    public constructor(aspectRatio: number) {
        super(FIELD_OF_VIEW, aspectRatio, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
        this.name = "PLAYER_CAMERA";
        this.position.z = INITIAL_CAMERA_POSITION_Z;
        this.position.y = INITIAL_CAMERA_POSITION_Y;
    }

    public onResize(): void {
        this.updateProjectionMatrix();
    }
}
