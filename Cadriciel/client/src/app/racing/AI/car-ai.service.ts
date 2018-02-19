import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { CommandController } from "../commandController";
import { GoFoward } from "../commands/carAICommands/goFoward";
import { TurnLeft } from "../commands/carAICommands/turnLeft";
import { Track } from "../../../../../common/racing/track";
import { Vector3, Raycaster, Scene, Intersection } from "three";

@Injectable()
export class CarAiService {
    private readonly DISTANCE_RAYCASTER_FROM_VEHICULE: number = 5;

    private _aiControl: CommandController;
    private _isGoingForward: boolean = false;
    private _isSteeringLeft: boolean = false;
    // private _isSteeringRight: boolean = false;
    // private _isBraking: boolean = false;
    public _scene: Scene;

    public constructor(private _car: Car, private _track: Track) {
        this._aiControl = new CommandController();
    }

    public update(): void {
        if (this._scene === undefined) {
            return;
        }
        this.projectInFrontOfCar();

        if (!this._isGoingForward) {
            this.goForward();
        }
        if (!this._isSteeringLeft) {
            this.goLeft();
        }
    }

    private goForward(): void {
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

    private projectInFrontOfCar(): void {
        const dir: Vector3 = this._car.direction.normalize();
        const posRaycaster: Vector3 = new Vector3(this._car.position.x - this._car.currentPosition.x, 0,
                                                  this._car.position.z - this._car.currentPosition.z);

        posRaycaster.x -= dir.x * this.DISTANCE_RAYCASTER_FROM_VEHICULE;
        posRaycaster.y = this.DISTANCE_RAYCASTER_FROM_VEHICULE;
        posRaycaster.z -= dir.z * this.DISTANCE_RAYCASTER_FROM_VEHICULE;

        const raycaster: Raycaster = new Raycaster(posRaycaster, new Vector3(0, -1, 0), 0, this.DISTANCE_RAYCASTER_FROM_VEHICULE + 1);
        const intersects: Intersection[] = raycaster.intersectObjects(this._scene.children);
        if (intersects.length !== 0) {
            console.log(intersects);
        } else {
            console.log("NOTHING");
        }

    }
}
