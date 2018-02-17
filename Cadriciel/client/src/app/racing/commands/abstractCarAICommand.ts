import { AbstractCommand } from "./abstractCommand";
import { Car } from "../car/car";

export abstract class AbstractCarAICommand extends AbstractCommand{

    public constructor(protected _car: Car) {
        super();
    }

    public abstract execute(): void;
}
