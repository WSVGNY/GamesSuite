import { AbstractCarAICommand } from "./../abstractCarAICommand";
import { Car } from "../../car/car";

export class ReleaseAccelerator extends AbstractCarAICommand {

    public constructor(car: Car) {
        super(car);
    }

    public execute(): void {
        Car.releaseAccelerator(this._car);
    }
}
