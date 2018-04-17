import { Injectable } from "@angular/core";
import { State } from "../state";
import { OpeningState } from "../openingState";
import { CountdownState } from "../countdownState";
import { RacingState } from "../racingState";
import { ResultsState } from "../resultsState";
import { ClosingState } from "../closingState";
import { StateTypes } from "../stateTypes";
import { GameUpdateManagerService } from "../../game-update-manager/game-update-manager.service";

@Injectable()
export class StateFactoryService {

    public constructor(
        private _gameUpdateService: GameUpdateManagerService,
    ) { }

    public getState(state: StateTypes): State {
        switch (state) {
            case StateTypes.Opening:
                return this.createOpeningState();
            case StateTypes.Countdown:
                return this.createCountdownState();
            case StateTypes.Racing:
                return this.createRacingState();
            case StateTypes.Results:
                return this.createResultsState();
            case StateTypes.Closing:
                return this.createClosingState();
            default:
                return undefined;
        }
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
            // this._gameUpdateService.aiCarService,
            // this._gameUpdateService.gameTimeService,
            // this._gameUpdateService.soundService
        );
    }

}
