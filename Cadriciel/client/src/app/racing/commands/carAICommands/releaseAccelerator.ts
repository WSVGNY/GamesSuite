import { AbstractCarAICommand } from "./../abstractCarAICommand";

export class ReleaseAccelerator extends AbstractCarAICommand {
    public execute(): void {
        this._car.releaseAccelerator();
    }
}
