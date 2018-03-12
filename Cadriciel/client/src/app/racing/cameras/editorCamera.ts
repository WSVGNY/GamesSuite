import { OrthographicCamera, Vector3 } from "three";

const HALF: number = 0.5;
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;

export class EditorCamera extends OrthographicCamera {

    public constructor(aspectRatio: number, viewSize: number) {
        super( -aspectRatio * viewSize * HALF,
               aspectRatio * viewSize * HALF,
               viewSize * HALF,
               -viewSize * HALF,
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
