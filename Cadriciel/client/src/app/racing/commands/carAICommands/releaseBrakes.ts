import { AbstractCarAICommand } from "./../abstractCarAICommand";
import { Car } from "../../car/car";

export class ReleaseBrakes extends AbstractCarAICommand {

    public constructor(car: Car) {
        super(car);
    }

    public execute(): void {
        Car.releaseBrakes(this._car);
    }
}
