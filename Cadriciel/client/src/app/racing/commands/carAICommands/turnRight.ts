import { AbstractCarAICommand } from "./../abstractCarAICommand";
import { Car } from "../../car/car";

export class TurnLeft extends AbstractCarAICommand {

    public constructor(private _car: Car) {
        super();
    }

    public execute(): void {
        this._car.steerRight();
    }
}
