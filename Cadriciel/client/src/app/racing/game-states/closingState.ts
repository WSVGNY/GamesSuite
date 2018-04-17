import { State } from "./state";
import { RacingGame } from "../race-game/racingGame";
// import { AICarService } from "../artificial-intelligence/ai-car.service";
// import { CollisionManagerService } from "../collision-manager/collision-manager.service";
// import { CameraManagerService } from "../cameras/camera-manager.service";
// import { CarTrackingManagerService } from "../carTracking-manager/car-tracking-manager.service";
// import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";
// import { SoundManagerService } from "../sound-service/sound-manager.service";

export class ClosingState implements State {

    public constructor(
        // private _aiCarService: AICarService,
        // private _collisionManager: CollisionManagerService,
        // private _cameraManager: CameraManagerService,
        // private _trackingManager: CarTrackingManagerService,
        // private _gameTimeManager: GameTimeManagerService,
        // private _soundManager: SoundManagerService
    ) { }

    public init(): void { }

    public update(racingGame: RacingGame): void { }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(racingGame: RacingGame): void { }
}
