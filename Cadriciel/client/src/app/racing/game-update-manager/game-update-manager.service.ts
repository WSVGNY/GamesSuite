import { Injectable } from "@angular/core";
import { Track } from "../../../../../common/racing/track";
import { CarTrackingManagerService } from "../carTracking-manager/car-tracking-manager.service";
import { CollisionManagerService } from "../collision-manager/collision-manager.service";
import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";
import { AICarService } from "../artificial-intelligence/ai-car.service";
import { State } from "../game-states/state";
import { OpeningState } from "../game-states/openingState";
import { RacingGame } from "../race-game/racingGame";
import { Vector3 } from "three";

@Injectable()
export class GameUpdateManagerService {

  private _currentState: State;

  public constructor(
    private _trackingManager: CarTrackingManagerService,
    private _collisionManager: CollisionManagerService,
    private _timeManager: GameTimeManagerService,
    private _aiCarService: AICarService
  ) { }

  private initialize(): void {
    this._currentState = new OpeningState(this, this._timeManager);
  }

  public update(racingGame: RacingGame): void {
    this._currentState.update(racingGame);
  }

}
