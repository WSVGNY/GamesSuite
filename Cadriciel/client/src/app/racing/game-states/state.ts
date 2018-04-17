import { RacingGame } from "../race-game/racingGame";

export interface State {
    update(racingGame: RacingGame): void;
    isStateOver(): boolean;
    advanceToNextState(racingGame: RacingGame): void;
    init(): void;
}
