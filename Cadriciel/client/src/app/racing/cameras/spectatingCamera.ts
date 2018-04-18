import { PerspectiveCamera, Vector3 } from "three";
import {
    GAME_FIELD_OF_VIEW,
    NEAR_CLIPPING_PLANE,
    FAR_CLIPPING_PLANE,
    SPECTATING_CAMERA_START_DISTANCE,
    SPECTATING_CAMERA_START_POSITION_Y,
    SPECTATING_CAMERA_TIMESTEP_ADJUSTMENT,
    SPECTATING_CAMERA_BASE, SPECTATING_CAMERA_INITIAL, SPECTATING_CAMERA_NAME
} from "../constants/camera.constants";

export class SpectatingCamera extends PerspectiveCamera {
    private _initialPosition: Vector3;
    private _xAxis: Vector3;
    private _yAxis: Vector3;

    public constructor(aspectRatio: number) {
        super(GAME_FIELD_OF_VIEW, aspectRatio, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
        this.name = SPECTATING_CAMERA_NAME;
    }

    public setInitialPosition(target: Vector3, direction: Vector3): void {
        const position: Vector3 = target.clone().add(direction.clone().multiplyScalar(SPECTATING_CAMERA_START_DISTANCE));
        position.y = SPECTATING_CAMERA_START_POSITION_Y;
        this._initialPosition = new Vector3(position.x, 0, position.z);
        this.setAxis(new Vector3(target.x, 0, target.z));
        this.position.copy(position);
        this.lookAt(target);
    }

    private setAxis(groundTarget: Vector3): void {
        this._xAxis = groundTarget.clone().sub(this._initialPosition.clone()).normalize();
        this._yAxis = new Vector3(0, 1, 0);
    }

    public updatePosition(timeStep: number): void {
        const displacement: Vector3 = new Vector3();
        displacement.add(this._xAxis.clone().multiplyScalar(timeStep * SPECTATING_CAMERA_TIMESTEP_ADJUSTMENT));
        displacement.add(this._yAxis.clone().multiplyScalar(
            Math.pow(SPECTATING_CAMERA_BASE, -((timeStep * SPECTATING_CAMERA_TIMESTEP_ADJUSTMENT) - SPECTATING_CAMERA_INITIAL))));
        const newPosition: Vector3 = this._initialPosition.clone().add(displacement);
        this.position.copy(newPosition);
    }

    public onResize(): void {
        this.updateProjectionMatrix();
    }
}
