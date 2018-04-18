import { State } from "./state";

export class StandbyState extends State {

    public init(): void { }

    public update(): void { }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(): void { }
}
