import { OrthographicCamera, Vector3 } from "three";
import { NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE } from "../constants/camera.constants";

export class EditorCamera extends OrthographicCamera {

    public constructor(aspectRatio: number, viewSize: number) {
        super(
            -aspectRatio * viewSize / 2,
            aspectRatio * viewSize / 2,
            viewSize / 2,
            -viewSize / 2,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE);
    }

    public setPosition(position: Vector3): void {
        this.position.set(position.x, position.y, position.z);
    }

    public onResize(): void {
        this.updateProjectionMatrix();
    }
}
