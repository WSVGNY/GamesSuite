import { State } from "./state";

export class ClosingState extends State {

    public init(): void {
        this._serviceLoader.endGameTableService.showTable = true;
    }

    public update(): void {
        this._serviceLoader.endGameTableService.setPlayers(this._racingGame.players);
    }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(): void { }
}
