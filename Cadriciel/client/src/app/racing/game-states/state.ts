import { RacingGame } from "../race-game/racingGame";
import { ServiceLoaderService } from "../service-loader/service-loader.service";

export abstract class State {

    public constructor(
        protected _serviceLoader: ServiceLoaderService,
        protected _racingGame: RacingGame
    ) { }

    public abstract update(): void;
    public abstract init(): void;
    protected abstract isStateOver(): boolean;
    protected abstract advanceToNextState(): void;
}
