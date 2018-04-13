import { PerspectiveCamera, Vector3 } from "three";
import { NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE, PREVIEW_FIELD_OF_VIEW } from "../constants/camera.constants";

export class PreviewCamera extends PerspectiveCamera {

    private readonly INITIAL_CAMERA_POSITION_Z: number = 0;
    private readonly INITIAL_CAMERA_POSITION_Y: number = 150;
    private readonly INITIAL_CAMERA_POSITION_X: number = -75;

    public constructor(aspectRatio: number) {
        super(PREVIEW_FIELD_OF_VIEW, aspectRatio, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
        this.name = "PREVIEW_CAMERA";
        this.position.z = this.INITIAL_CAMERA_POSITION_Z;
        this.position.y = this.INITIAL_CAMERA_POSITION_Y;
        this.position.x = this.INITIAL_CAMERA_POSITION_X;
        this.lookAt(new Vector3(0, 0, 0));
    }

    public onResize(): void {
        this.updateProjectionMatrix();
    }
}
