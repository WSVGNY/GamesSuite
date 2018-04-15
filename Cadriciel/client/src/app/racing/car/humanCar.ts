import { AbstractCar } from "./abstractCar";

export class HumanCar extends AbstractCar {

    public constructor() {
        super();
        this.bindKeys();
    }

    private bindKeys(): void {
        this.keyBoardService.bindFunctionToKeyDown(ACCELERATE_KEYCODE, () => this.accelerate());
        this.keyBoardService.bindFunctionToKeyDown(LEFT_KEYCODE, () => this.steerLeft());
        this.keyBoardService.bindFunctionToKeyDown(BRAKE_KEYCODE, () => this.brake());
        this.keyBoardService.bindFunctionToKeyDown(RIGHT_KEYCODE, () => this.steerRight());

        this.keyBoardService.bindFunctionToKeyUp(ACCELERATE_KEYCODE, () => this.releaseAccelerator());
        this.keyBoardService.bindFunctionToKeyUp(LEFT_KEYCODE, () => this.releaseSteering());
        this.keyBoardService.bindFunctionToKeyUp(BRAKE_KEYCODE, () => this.releaseBrakes());
        this.keyBoardService.bindFunctionToKeyUp(RIGHT_KEYCODE, () => this.releaseSteering());
    }

}
