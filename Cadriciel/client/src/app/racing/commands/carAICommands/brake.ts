import { AbstractCarAICommand } from "./../abstractCarAICommand";
import { Car } from "../../car/car";

export class GoFoward extends AbstractCarAICommand {

    public constructor(private _car: Car) {
        super();
    }

    public execute(): void {
        this._car._isAcceleratorPressed = false;
        this._car.brake();
    }
}
