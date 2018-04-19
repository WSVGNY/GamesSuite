import { State } from "./state";

export class StandbyState extends State {

    public initialize(): void { }

    public update(): void {
        // do nothing at the end of the game
        if (this.isStateOver()) {
            this.advanceToNextState();
        }
    }

    protected isStateOver(): boolean {
        return false;
    }

    protected advanceToNextState(): void { }
}
