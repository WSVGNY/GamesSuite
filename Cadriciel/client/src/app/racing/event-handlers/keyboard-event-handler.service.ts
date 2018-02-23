import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { CommandController } from "../commandController";
import { GoFoward } from "../commands/carAICommands/goFoward";
import { TurnLeft } from "../commands/carAICommands/turnLeft";
import { TurnRight } from "../commands/carAICommands/turnRight";
import { Brake } from "../commands/carAICommands/brake";
import { ReleaseAccelerator } from "../commands/carAICommands/releaseAccelerator";
import { ReleaseSteering } from "../commands/carAICommands/releaseSteering";

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d
const DAY_KEYCODE: number = 74;         // j
const NIGHT_KEYCODE: number = 78;       // n

@Injectable()
export class KeyboardEventHandlerService {

    private _carControl: CommandController;

    public constructor() { }

    public async initialize(): Promise<void> {
        this._carControl = new CommandController();
    }

    // tslint:disable-next-line:max-func-body-length
    public handleKeyDown(event: KeyboardEvent, car: Car): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._carControl.setCommand(new GoFoward(car));
                this._carControl.execute();
                break;
            case LEFT_KEYCODE:
                this._carControl.setCommand(new TurnLeft(car));
                this._carControl.execute();
                break;
            case RIGHT_KEYCODE:
                this._carControl.setCommand(new TurnRight(car));
                this._carControl.execute();
                break;
            case BRAKE_KEYCODE:
                this._carControl.setCommand(new Brake(car));
                this._carControl.execute();
                break;
            case DAY_KEYCODE:
                // this._dayTime = true;
                // this.renderSkyBox();
                // this._playerCar.dettachLight();
                break;
            case NIGHT_KEYCODE:
                // this._dayTime = false;
                // this.renderSkyBox();
                // this._playerCar.createLights();
                break;
            default:
                break;
        }
    }

    public handleKeyUp(event: KeyboardEvent, car: Car): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._carControl.setCommand(new ReleaseAccelerator(car));
                this._carControl.execute();
                break;
            case LEFT_KEYCODE:
            case RIGHT_KEYCODE:
                this._carControl.setCommand(new ReleaseSteering(car));
                this._carControl.execute();
                break;
            case BRAKE_KEYCODE:
                this._carControl.setCommand(new Brake(car));
                this._carControl.execute();
                // this._playerCar.setBackLightColor(YELLOW);
                break;
            default:
                break;
        }
    }
}
