import { State } from "./state";
import { StateType } from "./stateTypes";

export class ResultsTableState extends State {

    public initialize(): void {
        this._serviceLoader.endGameTableService.showTable = true;
        this._serviceLoader.endGameTableService.setPlayers(this._racingGame.players);
    }

    public update(): void {
        if (this.isStateOver()) {
            this.advanceToNextState();
        }
    }

    protected isStateOver(): boolean {
        return !this._serviceLoader.endGameTableService.showTable;
    }

    protected advanceToNextState(): void {
        this._racingGame.setState(StateType.Highscores);
    }
}
