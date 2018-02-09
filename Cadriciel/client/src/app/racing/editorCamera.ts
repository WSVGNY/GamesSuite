import { OrthographicCamera, Vector3 } from "three";

const HALF: number = 0.5;
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const VIEW_SIZE: number = 1000;

export class EditorCamera {

    private camera: OrthographicCamera;
    private aspectRatio: number = 0;

    public constructor(aspectRatio: number) {
        this.aspectRatio = aspectRatio;
        this.initialise();
    }

    private initialise(): void {
        this.camera = new OrthographicCamera(
            -this.aspectRatio * VIEW_SIZE * HALF,
            this.aspectRatio * VIEW_SIZE * HALF,
            VIEW_SIZE * HALF,
            -VIEW_SIZE * HALF,
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
