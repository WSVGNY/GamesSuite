import { Injectable } from "@angular/core";
import { CarTrackingManagerService } from "../carTracking-manager/car-tracking-manager.service";
import { CollisionManagerService } from "../collision-manager/collision-manager.service";
import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";
import { AICarService } from "../artificial-intelligence/ai-car.service";
import { State } from "../game-states/state";
import { RacingGame } from "../race-game/racingGame";
import { StateFactory } from "../game-states/stateFactory";
import { CameraManagerService } from "../cameras/camera-manager.service";

@Injectable()
export class GameUpdateManagerService {

  private _stateFactory: StateFactory;
  private _currentState: State;

  public constructor(
    private _aiCarService: AICarService,
    private _collisionManager: CollisionManagerService,
    private _cameraManager: CameraManagerService,
    private _trackingManager: CarTrackingManagerService,
    private _gameTimeManager: GameTimeManagerService
  ) {
    this.initialize();
  }

  private initialize(): void {
    this._stateFactory = new StateFactory(
      this._aiCarService,
      this._collisionManager,
      this._cameraManager,
      this._trackingManager,
      this._gameTimeManager
    );
    this.setState("OPENING");
  }

  public setState(stateType: string): void {
    this._currentState = this._stateFactory.getState(stateType);
  }

  public update(racingGame: RacingGame): void {
    this._currentState.update(this, racingGame);
  }

}
