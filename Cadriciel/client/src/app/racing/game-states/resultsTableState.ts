import { State } from "./state";
import { StateTypes } from "./stateTypes";

export class ResultsTableState extends State {

    public init(): void {
        this._serviceLoader.endGameTableService.showTable = true;
        this._serviceLoader.endGameTableService.setPlayers(this._racingGame.players);
    }

    public update(): void {
        if (!this._serviceLoader.endGameTableService.showTable) {
            this.advanceToNextState();
        }
    }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(): void {
        this._racingGame.setState(StateTypes.Highscores);
    }
}
