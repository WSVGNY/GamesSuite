import { OrthographicCamera, Vector3 } from "three";

const HALF: number = 0.5;
const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;

export class EditorCamera {

    private _camera: OrthographicCamera;
    private _aspectRatio: number = 0;
    private _viewSize: number = 0;

    public constructor(aspectRatio: number, viewSize: number) {
        this._aspectRatio = aspectRatio;
        this._viewSize = viewSize;
        this.initialise();
    }

    private initialise(): void {
        this._camera = new OrthographicCamera(
            -this._aspectRatio * this._viewSize * HALF,
            this._aspectRatio * this._viewSize * HALF,
            this._viewSize * HALF,
            -this._viewSize * HALF,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE);
    }

    public setPosition(position: Vector3): void {
        this._camera.position.set(position.x, position.y, position.z);
    }

    public get camera(): OrthographicCamera {
        return this._camera;
    }
}
