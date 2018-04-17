import { Injectable } from "@angular/core";
import { AICarService } from "../../artificial-intelligence/ai-car.service";
import { CollisionManagerService } from "../../collision-manager/collision-manager.service";
import { CameraManagerService } from "../../cameras/camera-manager.service";
import { CarTrackingManagerService } from "../../carTracking-manager/car-tracking-manager.service";
import { GameTimeManagerService } from "../../game-time-manager/game-time-manager.service";
import { State } from "../state";
import { OpeningState } from "../openingState";
import { CountdownState } from "../countdownState";
import { StateTypes } from "../stateTypes";
import { InitializationState } from "../initializationState";
import { ResultsState } from "../resultsState";
// import { ClosingState } from "../closingState";
// import { SoundManagerService } from "../../sound-service/sound-manager.service";
import { RacingState } from "../racingState";
import { CountdownService } from "../../countdown/countdown.service";

@Injectable()
export class StateFactoryService {

  public constructor(
    private _aiCarService: AICarService,
    private _collisionManager: CollisionManagerService,
    private _cameraManager: CameraManagerService,
    private _trackingManager: CarTrackingManagerService,
    private _gameTimeManager: GameTimeManagerService,
    private _countdownService: CountdownService
    // private _soundManager: SoundManagerService
  ) { }

  public getState(state: StateTypes): State {
    if (state === undefined) {
      return undefined;
    }

    if (state === StateTypes.Initialization) {
      return this.createInitializationState();
    } else if (state === StateTypes.Opening) {
      return this.createOpeningState();
    } else if (state === StateTypes.Countdown) {
      return this.createCountdownState();
    } else if (state === StateTypes.Racing) {
      return this.createRacingState();
    } else if (state === StateTypes.Results) {
      return this.createResultsState();
    } else if (state === StateTypes.Closing) {
      // return this.createClosingState();
    }

    return undefined;
  }

  private createInitializationState(): State {
    return new InitializationState(
      this._aiCarService,
      this._collisionManager,
      this._trackingManager,
      this._gameTimeManager,
      // this._soundManager
      this._cameraManager
    );
  }

  private createOpeningState(): State {
    return new OpeningState(
      this._cameraManager,
      this._gameTimeManager,
      // this._soundManager
    );
  }

  private createCountdownState(): State {
    return new CountdownState(
      this._gameTimeManager,
      this._countdownService
      // this._soundManager
    );
  }

  private createRacingState(): State {
    return new RacingState(
      this._aiCarService,
      this._collisionManager,
      this._cameraManager,
      this._trackingManager,
      this._gameTimeManager,
      // this._soundManager
    );
  }

  private createResultsState(): State {
    return new ResultsState(
      this._gameTimeManager,
      // this._soundManager
    );
  }

  // private createClosingState(): State {
  //   return new ClosingState(
  //     this._aiCarService,
  //     this._collisionManager,
  //     this._cameraManager,
  //     this._trackingManager,
  //     this._gameTimeManager,
  //     // this._soundManager
  //   );
  // }

}
