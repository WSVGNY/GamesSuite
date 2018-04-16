import { Injectable } from "@angular/core";
import { AICarService } from "../../artificial-intelligence/ai-car.service";
import { CollisionManagerService } from "../../collision-manager/collision-manager.service";
import { CameraManagerService } from "../../cameras/camera-manager.service";
import { CarTrackingManagerService } from "../../carTracking-manager/car-tracking-manager.service";
import { GameTimeManagerService } from "../../game-time-manager/game-time-manager.service";
import { State } from "../state";
import { OpeningState } from "../openingState";
import { CountdownState } from "../countdownState";
import { States } from "../states";

@Injectable()
export class StateFactoryService {

  public constructor(
    private _aiCarService: AICarService,
    private _collisionManager: CollisionManagerService,
    private _cameraManager: CameraManagerService,
    private _trackingManager: CarTrackingManagerService,
    private _gameTimeManager: GameTimeManagerService
  ) { }

  public getState(state: States): State {
    if (state === undefined) {
      return undefined;
    }

    if (state === States.Opening) {
      this.createOpeningState();
    } else if (state === States.Countdown) {
      this.createCountdownState();
    } /*else if (state === States.Racing) {
      return new Square();
    } else if (state === States.Result) {
      return new Square();
    } else if (state === States.Closing) {
      return new Square();
    }*/

    return undefined;
  }

  private createOpeningState(): State {
    return new OpeningState(
      this._aiCarService,
      this._collisionManager,
      this._cameraManager,
      this._trackingManager,
      this._gameTimeManager
    );
  }

  private createCountdownState(): State {
    return new CountdownState(
      this._aiCarService,
      this._collisionManager,
      this._cameraManager,
      this._trackingManager,
      this._gameTimeManager
    );
  }

}
