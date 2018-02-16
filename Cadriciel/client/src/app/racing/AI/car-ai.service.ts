import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { CommandController } from "../commandController";
import { GoFoward } from "../commands/carAICommands/goFoward";
import { Track } from "../../../../../common/racing/track";

@Injectable()
export class CarAiService {
    private _aiControl: CommandController;

    public constructor(private _car: Car, private _track: Track) {
        this._aiControl = new CommandController();
    }

    public calculateNewPosition(): void {
        //TODO: remove if
        if (this._track.name !== undefined) {
            this._aiControl.setCommand(new GoFoward(this._car));
        }
    }
}
