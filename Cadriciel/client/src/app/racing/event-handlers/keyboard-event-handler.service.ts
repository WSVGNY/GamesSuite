import { Injectable } from "@angular/core";
import { CommandController } from "../commands/commandController";
import { GoFoward } from "../commands/carAICommands/goFoward";
import { TurnLeft } from "../commands/carAICommands/turnLeft";
import { TurnRight } from "../commands/carAICommands/turnRight";
import { Brake } from "../commands/carAICommands/brake";
import { ReleaseAccelerator } from "../commands/carAICommands/releaseAccelerator";
import { ReleaseSteering } from "../commands/carAICommands/releaseSteering";
import { ReleaseBrakes } from "../commands/carAICommands/releaseBrakes";
import { Car } from "../car/car";
import { GameScene } from "../scenes/gameScene";
import { EnableDayMode } from "../commands/gameSceneCommands/enableDayMode";
import { EnableNightMode } from "../commands/gameSceneCommands/enableNightMode";
import { EnableDebugMode } from "../commands/gameSceneCommands/enableDebugMode";
import { DisableDebugMode } from "../commands/gameSceneCommands/disableDebugMode";

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d
const DAY_KEYCODE: number = 74;         // j
const NIGHT_KEYCODE: number = 78;       // n
const DEBUG_KEYCODE: number = 48;       // 0
const MUTE_KEYCODE: number = 77;       //  m
// const PLAY_KEYCODE: number = 80;       //  m

@Injectable()
export class KeyboardEventHandlerService {

    private _commandController: CommandController;

    public async initialize(): Promise<void> {
        this._commandController = new CommandController();
    }

    // tslint:disable-next-line:max-func-body-length
    public handleKeyDown(event: KeyboardEvent, gameScene: GameScene, cars: Car[]): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._commandController.command = new GoFoward(cars[0]);
                this._commandController.execute();
                // if (raceGame.sound.isPlaying() === true) {
                //     raceGame.sound.createAccelerationEffect("../../../assets/sounds/carAcceleration.mp3", raceGame.playerCar);
                // }
                // raceGame.sound.playAccelerationEffect();
                break;
            case LEFT_KEYCODE:
                this._commandController.command = new TurnLeft(cars[0]);
                this._commandController.execute();
                break;
            case RIGHT_KEYCODE:
                this._commandController.command = new TurnRight(cars[0]);
                this._commandController.execute();
                // raceGame.createSound("../../../assets/sounds/luigi.mp3");
                break;
            case BRAKE_KEYCODE:
                this._commandController.command = new Brake(cars[0]);
                this._commandController.execute();
                break;
            case DAY_KEYCODE:
                this._commandController.command = new EnableDayMode(gameScene, cars);
                this._commandController.execute();
                break;
            case NIGHT_KEYCODE:
                this._commandController.command = new EnableNightMode(gameScene, cars);
                this._commandController.execute();
                break;
            case DEBUG_KEYCODE:
                this._commandController.command = (gameScene.debugMode) ?
                    new DisableDebugMode(gameScene, cars) :
                    new EnableDebugMode(gameScene, cars);
                this._commandController.execute();
                break;
            case MUTE_KEYCODE:
                cars[0]._speed.negate();
                break;
            // case PLAY_KEYCODE:
            //     raceGame.sound.playMusic();
            //     break;
            default:
                break;
        }
    }

    public handleKeyUp(event: KeyboardEvent, car: Car): void {
        switch (event.keyCode) {
            case ACCELERATE_KEYCODE:
                this._commandController.command = new ReleaseAccelerator(car);
                this._commandController.execute();
                // raceGame.sound.stopAccelerationEffect();
                break;
            case LEFT_KEYCODE:
            case RIGHT_KEYCODE:
                this._commandController.command = new ReleaseSteering(car);
                this._commandController.execute();
                break;
            case BRAKE_KEYCODE:
                this._commandController.command = new ReleaseBrakes(car);
                this._commandController.execute();
                break;
            default:
                break;
        }
    }
}
