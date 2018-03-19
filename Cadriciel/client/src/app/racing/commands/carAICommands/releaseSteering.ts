import { AbstractCarAICommand } from "./../abstractCarAICommand";
import { Car } from "../../car/car";

export class ReleaseSteering extends AbstractCarAICommand {

    public constructor(car: Car) {
        super(car);
    }

    public execute(): void {
        Car.releaseSteering(this._car);
    }
}
