import { PerspectiveCamera, Vector3 } from "three";

const NEAR_CLIPPING_PLANE: number = 1;
const FAR_CLIPPING_PLANE: number = 1000;
const FIELD_OF_VIEW: number = 70;

export class SpectatingCamera extends PerspectiveCamera {

    private _initialPosition: Vector3;
    private _xAxis: Vector3;
    private _yAxis: Vector3;

    public constructor(aspectRatio: number) {
        super(FIELD_OF_VIEW, aspectRatio, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
        this.name = "SPECTATING_CAMERA";
    }

    public setInitialPosition(target: Vector3, direction: Vector3): void {
        const position: Vector3 = target.clone().add(direction.clone().multiplyScalar(50));
        position.y = 20;
        const groundPosition: Vector3 = position.clone();
        groundPosition.y = 0;
        const groundTarget: Vector3 = target.clone();
        groundTarget.y = 0;
        this._xAxis = groundTarget.clone().sub(groundPosition).normalize();
        this._yAxis = new Vector3(0, 1, 0);
        this._initialPosition = groundPosition.clone();
        this.position.copy(position);
        this.lookAt(target);
    }

    public updatePosition(timeStep: number): void {
        const displacement: Vector3 = new Vector3();
        displacement.add(this._xAxis.clone().multiplyScalar(timeStep));
        displacement.add(this._yAxis.clone().multiplyScalar(Math.pow(1.07, -(timeStep - 50))));
        const newPosition: Vector3 = this._initialPosition.clone().add(displacement);
        this.position.copy(newPosition);
    }

    public onResize(): void {
        this.updateProjectionMatrix();
    }
}
