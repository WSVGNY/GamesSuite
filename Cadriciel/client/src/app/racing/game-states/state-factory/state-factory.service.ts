import { Injectable } from "@angular/core";
import { AICarService } from "../../artificial-intelligence/ai-car.service";
import { CollisionManagerService } from "../../collision-manager/collision-manager.service";
import { CameraManagerService } from "../../cameras/camera-manager.service";
import { CarTrackingManagerService } from "../../carTracking-manager/car-tracking-manager.service";
import { GameTimeManagerService } from "../../game-time-manager/game-time-manager.service";
import { State } from "../state";
import { OpeningState } from "../openingState";
import { CountdowngState } from "../countdownState";

@Injectable()
export class StateFactoryService {

  public constructor(
    private _aiCarService: AICarService,
    private _collisionManager: CollisionManagerService,
    private _cameraManager: CameraManagerService,
    private _trackingManager: CarTrackingManagerService,
    private _gameTimeManager: GameTimeManagerService
  ) { }

  public getState(stateType: string): State {
    if (stateType === null) {
      return undefined;
    }

    if (stateType === "OPENING") {
      this.createOpeningState();
    } else if (stateType === "COUNTDOWN") {
      this.createCountdownState();
    } /*else if (stateType === "RACING") {
      return new Square();
    } else if (stateType === "RESULTS") {
      return new Square();
    } else if (stateType === "CLOSING") {
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
    return new CountdowngState(
      this._aiCarService,
      this._collisionManager,
      this._cameraManager,
      this._trackingManager,
      this._gameTimeManager
    );
  }

}
