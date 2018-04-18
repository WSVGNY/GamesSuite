import { PerspectiveCamera, Vector3 } from "three";
import {
    NEAR_CLIPPING_PLANE,
    FAR_CLIPPING_PLANE,
    PREVIEW_FIELD_OF_VIEW,
    INITIAL_PREVIEW_CAMERA_POSITION_Z,
    INITIAL_PREVIEW_CAMERA_POSITION_Y,
    INITIAL_PREVIEW_CAMERA_POSITION_X,
    PREVIEW_CAMERA_NAME
} from "../constants/camera.constants";

export class PreviewCamera extends PerspectiveCamera {

    public constructor(aspectRatio: number) {
        super(PREVIEW_FIELD_OF_VIEW, aspectRatio, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
        this.name = PREVIEW_CAMERA_NAME;
        this.position.z = INITIAL_PREVIEW_CAMERA_POSITION_Z;
        this.position.y = INITIAL_PREVIEW_CAMERA_POSITION_Y;
        this.position.x = INITIAL_PREVIEW_CAMERA_POSITION_X;
        this.lookAt(new Vector3(0, 0, 0));
    }

    public onResize(): void {
        this.updateProjectionMatrix();
    }
}
