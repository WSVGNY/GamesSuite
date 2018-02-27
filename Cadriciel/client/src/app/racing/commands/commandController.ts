import { AbstractCommand } from "./../commands/abstractCommand";

export class CommandController {

    private _command: AbstractCommand;

    public set command(command: AbstractCommand) {
        this._command = command;
    }

    public execute(): void {
        if (this._command !== undefined) {
            this._command.execute();
        }
    }
}
