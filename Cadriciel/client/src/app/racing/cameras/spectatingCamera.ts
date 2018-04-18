import { PerspectiveCamera, Vector3 } from "three";
import { GAME_FIELD_OF_VIEW, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE } from "../constants/camera.constants";

export class SpectatingCamera extends PerspectiveCamera {

    private readonly TIMESTEP_ADJUSTMENT: number = 0.01;
    private readonly START_DISTANCE: number = 50;
    private readonly START_POSITION_Y: number = 20;
    private readonly BASE: number = 1.07;
    private readonly INITIAL: number = 50;

    private _initialPosition: Vector3;
    private _xAxis: Vector3;
    private _yAxis: Vector3;

    public constructor(aspectRatio: number) {
        super(GAME_FIELD_OF_VIEW, aspectRatio, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
        this.name = "SPECTATING_CAMERA";
    }

    public setInitialPosition(target: Vector3, direction: Vector3): void {
        const position: Vector3 = target.clone().add(direction.clone().multiplyScalar(this.START_DISTANCE));
        position.y = this.START_POSITION_Y;
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
        displacement.add(this._xAxis.clone().multiplyScalar(timeStep * this.TIMESTEP_ADJUSTMENT));
        displacement.add(this._yAxis.clone().multiplyScalar(Math.pow(this.BASE, -((timeStep * this.TIMESTEP_ADJUSTMENT) - this.INITIAL))));
        const newPosition: Vector3 = this._initialPosition.clone().add(displacement);
        this.position.copy(newPosition);
    }

    public onResize(): void {
        this.updateProjectionMatrix();
    }
}
