import { Player } from "./player";
import { Car } from "../car/car";
import { Track } from "../../../../../common/racing/track";
import { GameScene } from "../scenes/gameScene";
import { Vector3, Camera } from "three";

export class RacingGame {

    public countdownOnScreenValue: string;

    private _players: Player[];
    private _cars: Car[];
    private _track: Track;
    private _gameScene: GameScene;
    private _isCountdownOver: boolean;
    // private _currentCamera: Camera;

    public constructor() { }

    public get playerCarPosition(): Vector3 {
        return undefined;
    }

    public get currentCamera(): Camera {
        return undefined;
    }

    public set isCountdownOver(value: boolean) {
        this._isCountdownOver = value;
    }
}
