import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { CommandController } from "../commandController";
import { GoFoward } from "../commands/carAICommands/goFoward";
import { TurnLeft } from "../commands/carAICommands/turnLeft";
import { Track } from "../../../../../common/racing/track";

@Injectable()
export class CarAiService {
    private _aiControl: CommandController;
    private _isGoingForward: boolean = false;
    private _isSteeringLeft: boolean = false;

    public constructor(private _car: Car, private _track: Track) {
        this._aiControl = new CommandController();
    }

    private goForward(): void {
        //TODO: remove if
        if (this._track === undefined) {
            this._aiControl.setCommand(new GoFoward(this._car));
            this._aiControl.execute();
            this._isGoingForward = true;
        }
    }

    private goLeft(): void {
        this._aiControl.setCommand(new TurnLeft(this._car));
        this._aiControl.execute();
    }

    public update(): void {
        if (!this._isGoingForward) {
            this.goForward();
        }
        if (!this._isSteeringLeft) {
            this.goLeft();
        }
    }

    // private projectInFrontOfCar(): void {

    // }
}
