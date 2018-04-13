import { Object3D } from "three";
import { Hitbox } from "../collision-manager/hitbox";
import { RaceProgressTracker } from "../carTracking-manager/raceProgressTracker";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { CarStructure } from "./carStructure";
import { CarControls } from "./carControls";

export abstract class AbstractCar extends Object3D {
    private _mesh: Object3D;
    private _hitbox: Hitbox;
    private _raceProgressTracker: RaceProgressTracker;

    public constructor(
        private _id: number,
        private keyBoardService: KeyboardEventHandlerService,
        private _carStructure: CarStructure = new CarStructure(),
        private _carControls: CarControls = new CarControls(),
        public trackPortionIndex: number = 0,
        public lapCounter: number = 0
    ) {
        super();
    }
}
