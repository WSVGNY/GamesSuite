import { AbstractCommand } from "./abstractCommand";
import { AICar } from "../car/aiCar";

export abstract class AbstractCarAICommand extends AbstractCommand {

    public constructor(protected _car: AICar) {
        super();
    }

    public abstract execute(): void;
}
