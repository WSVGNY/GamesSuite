import { State } from "./state";
import { RacingGame } from "../race-game/racingGame";
import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";
import { AICarService } from "../artificial-intelligence/ai-car.service";
import { CollisionManagerService } from "../collision-manager/collision-manager.service";
import { CameraManagerService } from "../cameras/camera-manager.service";
import { CarTrackingManagerService } from "../carTracking-manager/car-tracking-manager.service";
import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";
import { StateTypes } from "./stateTypes";
import { SoundManagerService } from "../sound-service/sound-manager.service";

export class InitializationState implements State {

    public constructor(
        private _aiCarService: AICarService,
        private _collisionManager: CollisionManagerService,
        private _cameraManager: CameraManagerService,
        private _trackingManager: CarTrackingManagerService,
        private _gameTimeManager: GameTimeManagerService,
        private _soundManager: SoundManagerService
    ) { }

    public init(racingGame?: RacingGame): void {
        this._aiCarService.initialize(racingGame.gameScene.trackMesh.trackPoints.toVectors3);
        this._collisionManager.track = racingGame.gameScene.trackMesh;
        this._cameraManager.initializeCameras(racingGame.aspectRatio);
        this._trackingManager.init(racingGame.gameScene.trackMesh.trackPoints.toVectors3);
        this._gameTimeManager.initializeDates();
        // this._soundManager.
    }

    public update(gameUpdateManager: GameUpdateManagerService, racingGame: RacingGame): void {
        this.advanceToNextState(gameUpdateManager);
    }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(gameUpdateManager: GameUpdateManagerService): void {
        gameUpdateManager.setState(StateTypes.Opening);
    }
}
