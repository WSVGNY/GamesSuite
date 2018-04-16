import { CollisionManagerService } from "../collision-manager/collision-manager.service";
import { CameraManagerService } from "../cameras/camera-manager.service";
import { CarTrackingManagerService } from "../carTracking-manager/car-tracking-manager.service";
import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";
import { AICarService } from "../artificial-intelligence/ai-car.service";

export abstract class AbstractState {

    public constructor(
        protected _aiCarService: AICarService,
        protected _collisionManager: CollisionManagerService,
        protected _cameraManager: CameraManagerService,
        protected _trackingManager: CarTrackingManagerService,
        protected _gameTimeManager: GameTimeManagerService
    ) { }
}
