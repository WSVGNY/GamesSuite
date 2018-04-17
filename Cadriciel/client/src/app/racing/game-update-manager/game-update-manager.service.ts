import { Injectable } from "@angular/core";
import { State } from "../game-states/state";
import { RacingGame } from "../race-game/racingGame";
import { StateFactoryService } from "../game-states/state-factory/state-factory.service";
import { StateTypes } from "../game-states/stateTypes";

@Injectable()
export class GameUpdateManagerService {

  private _currentState: State;

  public constructor(
    private _stateFactory: StateFactoryService
  ) { }

  public initialize(): void {
    this.setState(StateTypes.Initialization);
  }

  public setState(stateType: StateTypes): void {
    this._currentState = this._stateFactory.getState(stateType);
    this._currentState.init();
  }

  public update(racingGame: RacingGame): void {
    this._currentState.update(this, racingGame);
  }

}
