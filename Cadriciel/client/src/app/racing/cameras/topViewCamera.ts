import { OrthographicCamera } from "three";
import { HALF, PI_OVER_2 } from "../constants";
import { Car } from "../car/car";

const NEAR_CLIPPING_PLANE: number = 1;
const FAR_CLIPPING_PLANE: number = 1000;

const INITIAL_CAMERA_POSITION_Y: number = 10;
const VIEW_SIZE: number = 150;

export class TopViewCamera extends OrthographicCamera {

    public constructor(aspectRatio: number) {
        super(
            -aspectRatio * VIEW_SIZE * HALF,
            aspectRatio * VIEW_SIZE * HALF,
            VIEW_SIZE * HALF,
            -VIEW_SIZE * HALF,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );
        this.name = "PLAYER_CAMERA";
        this.rotateX(-PI_OVER_2);
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
