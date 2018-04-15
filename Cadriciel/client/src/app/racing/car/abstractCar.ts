import { Object3D, Vector3, ObjectLoader } from "three";
import { Hitbox } from "../collision-manager/hitbox";
import { RaceProgressTracker } from "../carTracking-manager/raceProgressTracker";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { CarStructure } from "./carStructure";
import { CarControls } from "./carControls";
import { DEFAULT_MASS, DEFAULT_WHEELBASE, DEFAULT_DRAG_COEFFICIENT, INITIAL_WEIGHT_DISTRIBUTION } from "../constants/car.constants";
import { CarLights } from "./carLights";
import { CAR_TEXTURE } from "../constants/texture.constants";

export abstract class AbstractCar extends Object3D {
    private _mesh: Object3D;
    private _hitbox: Hitbox;
    private _raceProgressTracker: RaceProgressTracker;

    public constructor(
        private _id: number,
        private keyBoardService: KeyboardEventHandlerService,
        private _carStructure: CarStructure = new CarStructure(),
        private _carControls: CarControls = new CarControls(),
        public lapCounter: number = 0
    ) {
        super();

        if (_carStructure.wheelbase <= 0) {
            console.error("Wheelbase should be greater than 0.");
            _carStructure.wheelbase = DEFAULT_WHEELBASE;
        }

        if (_carStructure.mass <= 0) {
            console.error("Mass should be greater than 0.");
            _carStructure.mass = DEFAULT_MASS;
        }

        if (_carStructure.dragCoefficient <= 0) {
            console.error("Drag coefficient should be greater than 0.");
            _carStructure.dragCoefficient = DEFAULT_DRAG_COEFFICIENT;
        }

        this.initAttributes();
    }

    private initAttributes(): void {
        this._carControls.isBraking = false;
        this._carControls.steeringWheelDirection = 0;
        this._carStructure.weightRear = INITIAL_WEIGHT_DISTRIBUTION;
        this._carControls.speed = new Vector3(0, 0, 0);
        this.position.add(new Vector3(0, 0, 0));
        this._carStructure.lights = new CarLights();
    }

    private async load(): Promise<Object3D> {
        return new Promise<Object3D>((resolve, reject) => {
            const loader: ObjectLoader = new ObjectLoader();
            loader.load(CAR_TEXTURE, (object: Object3D) => {
                resolve(object);
            });
        });
    }

    public async init(startPoint: Vector3, rotationAngle: number): Promise<void> {
        await this.initMesh(startPoint, rotationAngle);
        this.initHitBox();
        this.initRaceProgressTracker();
        this.initLights();
    }

    private async initMesh(startPoint: Vector3, rotationAngle: number): Promise<void> {
        this._mesh = await this.load();
        this._mesh.position.add(startPoint);
        this._mesh.setRotationFromAxisAngle(new Vector3(0, 1, 0), rotationAngle);
        this._mesh.updateMatrix();
        this.add(this._mesh);
    }

    private initHitBox(): void {
        this._hitbox = new Hitbox();
    }

    private initRaceProgressTracker(): void {
        this._raceProgressTracker = new RaceProgressTracker();
    }

    private initLights(): void {
        this._mesh.add(this._carStructure.lights);
        this.turnLightsOff();
        this._carStructure.lights.turnBackLightsOff();
    }

    public turnLightsOff(): void {
        this._carStructure.lights.turnOff();
    }
}
