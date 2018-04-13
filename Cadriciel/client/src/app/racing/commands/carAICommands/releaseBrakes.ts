import { AbstractCarAICommand } from "./../abstractCarAICommand";

export class ReleaseBrakes extends AbstractCarAICommand {
    public execute(): void {
        this._car.releaseBrakes();
    }
}
