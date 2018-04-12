import { AbstractCarAICommand } from "./../abstractCarAICommand";

export class Brake extends AbstractCarAICommand {
    public execute(): void {
        this._car.releaseAccelerator();
        this._car.brake();
    }
}
