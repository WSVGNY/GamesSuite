import { Injectable } from "@angular/core";
import { CommandController } from "../commandController";

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d

@Injectable()
export class KeyboardEventHandlerService {

  private _editorControl: CommandController;

  public constructor() {}

  public handleKeyDown(event: KeyboardEvent): void {
    switch (event.keyCode) {
        case ACCELERATE_KEYCODE:
            this._playerCar.accelerate();
            break;
        case LEFT_KEYCODE:
            this._playerCar.steerLeft();
            break;
        case RIGHT_KEYCODE:
            this._playerCar.steerRight();
            break;
        case BRAKE_KEYCODE:
            this._playerCar.reverse();
            break;
        default:
            break;
    }
  }

  public handleKeyUp(event: KeyboardEvent): void {
    switch (event.keyCode) {
        case ACCELERATE_KEYCODE:
            this._playerCar.releaseAccelerator();
            break;
        case LEFT_KEYCODE:
        case RIGHT_KEYCODE:
            this._playerCar.releaseSteering();
            break;
        case BRAKE_KEYCODE:
            this._playerCar.releaseReverse();
            break;
        default:
            break;
    }
  }
}
