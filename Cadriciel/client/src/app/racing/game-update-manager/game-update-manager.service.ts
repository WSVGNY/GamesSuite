import { Injectable } from "@angular/core";
import { State } from "../game-states/state";
import { RacingGame } from "../race-game/racingGame";
import { StateFactoryService } from "../game-states/state-factory/state-factory.service";
import { States } from "../game-states/states";

@Injectable()
export class GameUpdateManagerService {

  private _currentState: State;

  public constructor(
    private _stateFactory: StateFactoryService
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.setState(States.Opening);
  }

  public setState(state: States): void {
    this._currentState = this._stateFactory.getState(state);
    this._currentState.init();
  }

  public update(racingGame: RacingGame): void {
    this._currentState.update(this, racingGame);
  }

}
