import { Injectable } from "@angular/core";
import { RacingGame } from "../../race-game/racingGame";
import { ServiceLoaderService } from "../../service-loader/service-loader.service";
import { State } from "../state";
import { OpeningState } from "../openingState";
import { CountdownState } from "../countdownState";
import { RacingState } from "../racingState";
import { ResultsState } from "../resultsState";
import { ClosingState } from "../closingState";
import { StateTypes } from "../stateTypes";

@Injectable()
export class StateFactoryService {

    public constructor(
        private _serviceLoader: ServiceLoaderService,
    ) { }

    public getState(state: StateTypes, racingGame: RacingGame): State {
        switch (state) {
            case StateTypes.Opening:
                return this.createOpeningState(racingGame);
            case StateTypes.Countdown:
                return this.createCountdownState(racingGame);
            case StateTypes.Racing:
                return this.createRacingState(racingGame);
            case StateTypes.Results:
                return this.createResultsState(racingGame);
            case StateTypes.Closing:
                return this.createClosingState(racingGame);
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

    private createClosingState(racingGame: RacingGame): State {
        return new ClosingState(this._serviceLoader, racingGame);
    }

}
