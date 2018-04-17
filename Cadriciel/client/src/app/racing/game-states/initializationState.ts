import { State } from "./state";
import { RacingGame } from "../race-game/racingGame";
import { AICarService } from "../artificial-intelligence/ai-car.service";
import { CollisionManagerService } from "../collision-manager/collision-manager.service";
import { CarTrackingManagerService } from "../carTracking-manager/car-tracking-manager.service";
import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";
import { StateTypes } from "./stateTypes";
import { CameraManagerService } from "../cameras/camera-manager.service";

export class InitializationState implements State {

    public constructor(
        private _aiCarService: AICarService,
        private _collisionManager: CollisionManagerService,
        private _trackingManager: CarTrackingManagerService,
        private _gameTimeManager: GameTimeManagerService,
        private _cameraManager: CameraManagerService
    ) { }

    public init(racingGame?: RacingGame): void { }

    public update(racingGame: RacingGame): void {
        this._aiCarService.initialize(racingGame.gameScene.trackMesh.trackPoints.toVectors3);
        this._collisionManager.track = racingGame.gameScene.trackMesh;
        this._trackingManager.init(racingGame.gameScene.trackMesh.trackPoints.toVectors3);
        this._gameTimeManager.initializeDates();
        this._cameraManager.initializeSpectatingCameraPosition(racingGame.playerCar.currentPosition, racingGame.playerCar.direction);

        this.advanceToNextState(racingGame);
    }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(racingGame: RacingGame): void {
        racingGame.setState(StateTypes.Opening);
    }
}
