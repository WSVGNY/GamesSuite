import { OrthographicCamera, Vector3 } from "three";
import {
    NEAR_CLIPPING_PLANE,
    FAR_CLIPPING_PLANE,
    TOP_VIEW_CAMERA_VIEW_SIZE,
    INITIAL_TOP_VIEW_CAMERA_POSITION_Y,
    TOP_VIEW_CAMERA_NAME
} from "../constants/camera.constants";
import { PI_OVER_2 } from "../constants/math.constants";

export class TopViewCamera extends OrthographicCamera {

    public constructor(aspectRatio: number) {
        super(
            -aspectRatio * TOP_VIEW_CAMERA_VIEW_SIZE / 2,
            aspectRatio * TOP_VIEW_CAMERA_VIEW_SIZE / 2,
            TOP_VIEW_CAMERA_VIEW_SIZE / 2,
            -TOP_VIEW_CAMERA_VIEW_SIZE / 2,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
        this.name = TOP_VIEW_CAMERA_NAME;
        this.rotateX(-PI_OVER_2);
        this.rotateZ(-PI_OVER_2);
        this.position.setY(INITIAL_TOP_VIEW_CAMERA_POSITION_Y);
    }

    public onResize(): void {
        this.updateProjectionMatrix();
    }

    public updatePosition(position: Vector3): void {
        this.position.setX(position.x);
        this.position.setZ(position.z);
    }
}
