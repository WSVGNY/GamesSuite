import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { GameScene } from "../scenes/gameScene";

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d
const DAY_KEYCODE: number = 74;         // j
const NIGHT_KEYCODE: number = 78;       // n
const DEBUG_KEYCODE: number = 48;       // 0
// const MUTE_KEYCODE: number = 77;       //  m
// const PLAY_KEYCODE: number = 80;       //  m

interface CallbackWithParameters {
    callback: Function;
    parameters?: {};
}

@Injectable()
export class KeyboardEventHandlerService {

    private _keyDownFunctions: Map<number, Array<CallbackWithParameters>>;
    private _keyUpFunctions: Map<number, Array<CallbackWithParameters>>;

    public initialize(): void {
        this._keyDownFunctions = new Map();
        this._keyUpFunctions = new Map();
    }

    public bindFunctionToKeyDown(keyCode: number, functionToBind: CallbackWithParameters): void {
        if (this._keyDownFunctions.get(keyCode) === undefined) {
            this._keyDownFunctions.set(keyCode, new Array());
        }
        const wdsf: Array<CallbackWithParameters> = this._keyDownFunctions.get(keyCode);
        wdsf.push(functionToBind);
        this._keyDownFunctions.set(
            keyCode,
            wdsf
        );
    }

    public bindFunctionToKeyUp(keyCode: number, functionToBind: CallbackWithParameters): void {
        if (this._keyUpFunctions.get(keyCode) === undefined) {
            this._keyUpFunctions.set(keyCode, new Array());
        }
        this._keyUpFunctions.get(keyCode).push(functionToBind);
    }

    public handleKeyDown(keyCode: number): void {
        if (this._keyUpFunctions.get(keyCode) !== undefined) {
            const functionsToExecute: Array<CallbackWithParameters> = this._keyDownFunctions.get(keyCode);
            functionsToExecute.forEach((callback: CallbackWithParameters) => {
                callback.callback(callback.parameters);
            });
        }
    }

    public handleKeyUp(keyCode: number): void {
        if (this._keyUpFunctions.get(keyCode) !== undefined) {
            const functionsToExecute: Array<CallbackWithParameters> = this._keyUpFunctions.get(keyCode);
            functionsToExecute.forEach((callback: CallbackWithParameters) => callback.callback(callback.parameters));
        }
    }

    public bindCarKeys(car: Car): void {
        this.bindCarBreakKeyDown(car);
        this.bindCarBreakKeyUp(car);
        this.bindCarForwardKeyDown(car);
        this.bindCarForwardKeyUp(car);
        this.bindCarLeftKeyDown(car);
        this.bindCarLeftKeyUp(car);
        this.bindCarRightKeyDown(car);
        this.bindCarRightKeyUp(car);
    }

    public bindGameSceneKeys(gameScene: GameScene): void {
        this.bindFunctionToKeyDown(DAY_KEYCODE, { parameters: gameScene, callback: gameScene.changeTimeOfDay });
        this.bindFunctionToKeyDown(NIGHT_KEYCODE, { parameters: gameScene, callback: Car.releaseBrakes });
        this.bindFunctionToKeyDown(DEBUG_KEYCODE, { parameters: gameScene, callback: Car.releaseBrakes });
    }

    private bindCarForwardKeyDown(car: Car): void {
        this.bindFunctionToKeyDown(ACCELERATE_KEYCODE, { parameters: car, callback: Car.releaseBrakes });
        this.bindFunctionToKeyDown(ACCELERATE_KEYCODE, { parameters: car, callback: Car.accelerate });
    }

    private bindCarForwardKeyUp(car: Car): void {
        this.bindFunctionToKeyUp(ACCELERATE_KEYCODE, { parameters: car, callback: Car.releaseAccelerator });
    }

    private bindCarLeftKeyDown(car: Car): void {
        this.bindFunctionToKeyDown(LEFT_KEYCODE, { parameters: car, callback: Car.steerLeft });
    }

    private bindCarLeftKeyUp(car: Car): void {
        this.bindFunctionToKeyUp(LEFT_KEYCODE, { parameters: car, callback: Car.releaseSteering });
    }

    private bindCarRightKeyDown(car: Car): void {
        this.bindFunctionToKeyDown(RIGHT_KEYCODE, { parameters: car, callback: Car.steerRight });
    }

    private bindCarRightKeyUp(car: Car): void {
        this.bindFunctionToKeyUp(RIGHT_KEYCODE, { parameters: car, callback: Car.releaseSteering });
    }

    private bindCarBreakKeyDown(car: Car): void {
        this.bindFunctionToKeyDown(BRAKE_KEYCODE, { parameters: car, callback: Car.releaseAccelerator });
        this.bindFunctionToKeyDown(BRAKE_KEYCODE, { parameters: car, callback: Car.brake });
    }

    private bindCarBreakKeyUp(car: Car): void {
        this.bindFunctionToKeyUp(BRAKE_KEYCODE, { parameters: car, callback: Car.releaseBrakes });
    }

    // tslint:disable-next-line:max-func-body-length
    // public handleKeyDown(event: KeyboardEvent, gameScene: GameScene, cars: Car[]): void {
    //     switch (event.keyCode) {
    //         case ACCELERATE_KEYCODE:
    //             this._commandController.command = new GoFoward(cars[0]);
    //             this._commandController.execute();
    //             // if (raceGame.sound.isPlaying() === true) {
    //             //     raceGame.sound.createAccelerationEffect("../../../assets/sounds/carAcceleration.mp3", raceGame.playerCar);
    //             // }
    //             // raceGame.sound.playAccelerationEffect();
    //             break;
    //         case LEFT_KEYCODE:
    //             this._commandController.command = new TurnLeft(cars[0]);
    //             this._commandController.execute();
    //             break;
    //         case RIGHT_KEYCODE:
    //             this._commandController.command = new TurnRight(cars[0]);
    //             this._commandController.execute();
    //             // raceGame.createSound("../../../assets/sounds/luigi.mp3");
    //             break;
    //         case BRAKE_KEYCODE:
    //             this._commandController.command = new Brake(cars[0]);
    //             this._commandController.execute();
    //             break;
    //         case DAY_KEYCODE:
    //             this._commandController.command = new EnableDayMode(gameScene, cars);
    //             this._commandController.execute();
    //             break;
    //         case NIGHT_KEYCODE:
    //             this._commandController.command = new EnableNightMode(gameScene, cars);
    //             this._commandController.execute();
    //             break;
    //         case DEBUG_KEYCODE:
    //             this._commandController.command = (gameScene.debugMode) ?
    //                 new DisableDebugMode(gameScene, cars) :
    //                 new EnableDebugMode(gameScene, cars);
    //             this._commandController.execute();
    //             break;
    //         // case MUTE_KEYCODE:
    //         //     raceGame.sound.stopMusic();
    //         //     break;
    //         // case PLAY_KEYCODE:
    //         //     raceGame.sound.playMusic();
    //         //     break;
    //         default:
    //             break;
    //     }
    // }

    // public handleKeyUp(event: KeyboardEvent, car: Car): void {
    //     switch (event.keyCode) {
    //         case ACCELERATE_KEYCODE:
    //             this._commandController.command = new ReleaseAccelerator(car);
    //             this._commandController.execute();
    //             // raceGame.sound.stopAccelerationEffect();
    //             break;
    //         case LEFT_KEYCODE:
    //         case RIGHT_KEYCODE:
    //             this._commandController.command = new ReleaseSteering(car);
    //             this._commandController.execute();
    //             break;
    //         case BRAKE_KEYCODE:
    //             this._commandController.command = new ReleaseBrakes(car);
    //             this._commandController.execute();
    //             break;
    //         default:
    //             break;
    //     }
    // }
}
