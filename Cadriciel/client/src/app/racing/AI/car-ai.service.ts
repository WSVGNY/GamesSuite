import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { CommandController } from "../commandController";
import { GoFoward } from "../commands/carAICommands/goFoward";

@Injectable()
export class CarAiService {
  private _aiControl: CommandController;

  public constructor(private _car: Car) {
    _car = new Car();
    this._aiControl = new CommandController();
  }

  public calculateNewPosition(): void {
    this._aiControl.setCommand(new GoFoward(this._car));
  }
}
