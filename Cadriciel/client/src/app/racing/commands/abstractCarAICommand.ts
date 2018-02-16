import { AbstractCommand } from "./abstractCommand";

export abstract class AbstractCarAICommand extends AbstractCommand {

    public constructor() {
        super();
    }

    public abstract execute(): void;
}
