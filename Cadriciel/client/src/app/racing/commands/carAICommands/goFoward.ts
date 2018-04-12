import { AbstractCarAICommand } from "./../abstractCarAICommand";

export class GoFoward extends AbstractCarAICommand {
    public execute(): void {
        this._car.releaseBrakes();
        this._car.accelerate();
    }
}
