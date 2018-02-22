import { AbstractCommand } from "./commands/abstractCommand";

export class CommandController {

    private command: AbstractCommand;

    public constructor() {}

    public setCommand (command: AbstractCommand): void {
      this.command = command;
    }

    public execute(): void {
      if (this.command !== undefined) {
        this.command.execute();
      }
    }
  }
