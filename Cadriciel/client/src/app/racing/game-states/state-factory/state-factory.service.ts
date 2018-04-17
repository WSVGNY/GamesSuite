import { Injectable } from "@angular/core";
import { State } from "../state";
import { OpeningState } from "../openingState";
import { CountdownState } from "../countdownState";
import { RacingState } from "../racingState";
import { ResultsState } from "../resultsState";
import { ClosingState } from "../closingState";
import { StateTypes } from "../stateTypes";
import { GameUpdateManagerService } from "../../game-update-manager/game-update-manager.service";
import { EndGameTableService } from "../../scoreboard/end-game-table/end-game-table.service";

@Injectable()
export class StateFactoryService {

  public constructor(
    private _gameUpdateService: GameUpdateManagerService,
    private _endGameTableService: EndGameTableService
  ) { }

  public getState(state: StateTypes): State {
    if (state === undefined) {
      return undefined;
    }

    if (state === StateTypes.Opening) {
      return this.createOpeningState();
    } else if (state === StateTypes.Countdown) {
      return this.createCountdownState();
    } else if (state === StateTypes.Racing) {
      return this.createRacingState();
    } else if (state === StateTypes.Results) {
      return this.createResultsState();
    } else if (state === StateTypes.Closing) {
      return this.createClosingState();
    }

    return undefined;
  }

  private createOpeningState(): State {
    return new OpeningState(
      this._gameUpdateService.cameraService,
      this._gameUpdateService.gameTimeService,
      this._gameUpdateService.soundService
    );
  }

  private createCountdownState(): State {
    return new CountdownState(
      this._gameUpdateService.gameTimeService,
      this._gameUpdateService.countdownService,
      this._gameUpdateService.soundService
    );
  }

  private createRacingState(): State {
    return new RacingState(
      this._gameUpdateService.aiCarService,
      this._gameUpdateService.collisionService,
      this._gameUpdateService.cameraService,
      this._gameUpdateService.trackingService,
      this._gameUpdateService.gameTimeService,
      this._gameUpdateService.soundService
    );
  }

  private createResultsState(): State {
    return new ResultsState(
      this._gameUpdateService.gameTimeService,
      // this._soundManager
    );
  }

  private createClosingState(): State {
    return new ClosingState(
      this._endGameTableService
      // this._gameUpdateService.aiCarService,
      // this._gameUpdateService.gameTimeService,
      // this._gameUpdateService.soundService
    );
  }

}
