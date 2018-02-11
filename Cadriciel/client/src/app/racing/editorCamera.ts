import { OrthographicCamera, Vector3 } from "three";

const HALF: number = 0.5;
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;

export class EditorCamera {

    private camera: OrthographicCamera;
    private aspectRatio: number = 0;
    private viewSize: number = 0;

    public constructor(aspectRatio: number, viewSize: number) {
        this.aspectRatio = aspectRatio;
        this.viewSize = viewSize;
        this.initialise();
    }

    private initialise(): void {
        this.camera = new OrthographicCamera(
            -this.aspectRatio * this.viewSize * HALF,
            this.aspectRatio * this.viewSize * HALF,
            this.viewSize * HALF,
            -this.viewSize * HALF,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE);
    }

    public setPosition(position: Vector3): void {
        this.camera.position.set(position.x, position.y, position.z);
    }

    public get $camera(): OrthographicCamera {
        return this.camera;
    }
}
