import { Injectable } from "@angular/core";
import { RacingGame } from "../../race-game/racingGame";
import { ServiceLoaderService } from "../../service-loader/service-loader.service";
import { State } from "../state";
import { OpeningState } from "../openingState";
import { CountdownState } from "../countdownState";
import { RacingState } from "../racingState";
import { ResultsState } from "../resultsState";
import { StateType } from "../stateTypes";
import { ResultsTableState } from "../resultsTableState";
import { HighscoreState } from "../highscoreState";
import { StandbyState } from "../standbyState";

@Injectable()
export class StateFactoryService {

    public constructor(
        private _serviceLoader: ServiceLoaderService,
    ) { }

    public getState(state: StateType, racingGame: RacingGame): State {
        switch (state) {
            case StateType.Opening:
                return this.createOpeningState(racingGame);
            case StateType.Countdown:
                return this.createCountdownState(racingGame);
            case StateType.Racing:
                return this.createRacingState(racingGame);
            case StateType.Results:
                return this.createResultsState(racingGame);
            case StateType.ResultsTable:
                return this.createResultsTableState(racingGame);
            case StateType.Highscores:
                return this.createHighscoreState(racingGame);
            case StateType.Standby:
                return this.createStandbyState(racingGame);
            default:
                return undefined;
        }
    }

    private createOpeningState(racingGame: RacingGame): State {
        return new OpeningState(this._serviceLoader, racingGame);
    }

    private createCountdownState(racingGame: RacingGame): State {
        return new CountdownState(this._serviceLoader, racingGame);
    }

    private createRacingState(racingGame: RacingGame): State {
        return new RacingState(this._serviceLoader, racingGame);
    }

    private createResultsState(racingGame: RacingGame): State {
        return new ResultsState(this._serviceLoader, racingGame);
    }

    private createResultsTableState(racingGame: RacingGame): State {
        return new ResultsTableState(this._serviceLoader, racingGame);
    }

    private createHighscoreState(racingGame: RacingGame): State {
        return new HighscoreState(this._serviceLoader, racingGame);
    }

    private createStandbyState(racingGame: RacingGame): State {
        return new StandbyState(this._serviceLoader, racingGame);
    }

}
