import { AbstractCarAICommand } from "./../abstractCarAICommand";

export class TurnLeft extends AbstractCarAICommand {
    public execute(): void {
        this._car.steerLeft();
    }
}
