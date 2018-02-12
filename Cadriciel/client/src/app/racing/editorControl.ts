import { AbstractCommand } from "./commands/abstractCommand";

export class EditorControl {

    private command: AbstractCommand;

    public constructor() {}

    public setCommand (command: AbstractCommand): void {
      this.command = command;
    }

    public execute(): void {
      this.command.execute();
    }
  }
