import { AbstractCar } from "./abstractCar";
import { ACCELERATE_KEYCODE, LEFT_KEYCODE, BRAKE_KEYCODE, RIGHT_KEYCODE } from "../constants/keycode.constants";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { CarStructure } from "./carStructure";
import { CarControls } from "./carControls";

export class HumanCar extends AbstractCar {

    public constructor(
        _id: number,
        _carStructure: CarStructure,
        _carControls: CarControls,
        lapCounter: number = 0,
        private keyBoardService: KeyboardEventHandlerService) {
        super(_id, _carStructure, _carControls, lapCounter);
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
