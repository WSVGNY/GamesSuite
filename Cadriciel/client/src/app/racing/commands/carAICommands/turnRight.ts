import { AbstractCarAICommand } from "./../abstractCarAICommand";

export class TurnRight extends AbstractCarAICommand {
    public execute(): void {
        this._car.steerRight();
    }
}
