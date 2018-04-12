import { OrthographicCamera } from "three";
import { Car } from "../car/car";
import { NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE } from "../constants/camera.constants";
import { PI_OVER_2 } from "../constants/math.constants";

const INITIAL_CAMERA_POSITION_Y: number = 10;
const VIEW_SIZE: number = 150;

export class TopViewCamera extends OrthographicCamera {

    public constructor(aspectRatio: number) {
        super(
            -aspectRatio * VIEW_SIZE / 2,
            aspectRatio * VIEW_SIZE / 2,
            VIEW_SIZE / 2,
            -VIEW_SIZE / 2,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
        this.name = "PLAYER_CAMERA";
        this.rotateX(-PI_OVER_2);
        this.rotateZ(-PI_OVER_2);
        this.position.setY(INITIAL_CAMERA_POSITION_Y);
    }

    public onResize(): void {
        this.updateProjectionMatrix();
    }

    public updatePosition(car: Car): void {
        this.position.setX(car.currentPosition.x);
        this.position.setZ(car.currentPosition.z);
    }
}
