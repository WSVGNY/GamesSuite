import { AbstractCarAICommand } from "./../abstractCarAICommand";

export class ReleaseSteering extends AbstractCarAICommand {
    public execute(): void {
        this._car.releaseSteering();
    }
}
