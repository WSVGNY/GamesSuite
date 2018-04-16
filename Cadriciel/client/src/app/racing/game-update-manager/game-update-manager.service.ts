import { Injectable } from "@angular/core";
import { State } from "../game-states/state";
import { RacingGame } from "../race-game/racingGame";
import { StateFactoryService } from "../game-states/state-factory/state-factory.service";

@Injectable()
export class GameUpdateManagerService {

  private _currentState: State;

  public constructor(
    private _stateFactory: StateFactoryService
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.setState("OPENING");
  }

  public setState(stateType: string): void {
    this._currentState = this._stateFactory.getState(stateType);
  }

  public update(racingGame: RacingGame): void {
    this._currentState.update(this, racingGame);
  }

}
