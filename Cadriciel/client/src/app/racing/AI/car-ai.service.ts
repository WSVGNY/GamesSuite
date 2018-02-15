import { Injectable } from "@angular/core";
//import { Car } from "../car/car";
import { CommandController } from "../commandController";

@Injectable()
export class CarAiService {
  private _aiControl: CommandController;

  public constructor(/*private _car: Car*/) {
    //_car = new Car();
    this._aiControl = new CommandController();
  }

  public calculateNewPosition(): void {
    //this._aiControl.setCommand()
  }
}
