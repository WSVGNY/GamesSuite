import { AbstractCarAICommand } from "./../abstractCarAICommand";
import { Car } from "../../car/car";

export class ReleaseSteering extends AbstractCarAICommand {

    public constructor(private _car: Car) {
        super();
    }

    public execute(): void {
        this._car.releaseSteering();
    }
}
