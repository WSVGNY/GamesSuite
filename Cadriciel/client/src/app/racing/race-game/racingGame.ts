import { Player } from "./player";
import { Car } from "../car/car";
import { Track } from "../../../../../common/racing/track";
import { GameScene } from "../scenes/gameScene";
import { CameraManagerService } from "../cameras/camera-manager.service";
import { Vector3, Camera } from "three";

export class RacingGame {

    private _players: Player[];
    private _cars: Car[];
    private _track: Track;
    private _gameScene: GameScene;

    public constructor(private _cameraManager: CameraManagerService) { }

    public updateCamera(position: Vector3, elaspedTime?: number): void {
        this._cameraManager.updateCameraPositions(position, elaspedTime);
    }

    public get playerCarPosition(): Vector3 {
        return undefined;
    }

    public get currentCamera(): Camera {
        return undefined;
    }
}
