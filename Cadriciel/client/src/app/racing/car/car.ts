import {
    Vector3, Matrix4, Object3D, ObjectLoader, Quaternion, Camera, Mesh, MeshBasicMaterial, BoxGeometry
} from "three";
import { Engine } from "./engine";
import {
    MS_TO_SECONDS, RAD_TO_DEG, CAR_TEXTURE, ACCELERATE_KEYCODE, LEFT_KEYCODE, BRAKE_KEYCODE,
    RIGHT_KEYCODE
} from "../constants";
import { Wheel } from "./wheel";
import { CarConfig } from "./carConfig";
import { CarLights } from "./carLights";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { Physics } from "./physics";

export class Car extends Object3D {

    private readonly _engine: Engine;
    private readonly _mass: number;
    private readonly _rearWheel: Wheel;
    private readonly _wheelbase: number;
    private readonly _dragCoefficient: number;
    private _mesh: Object3D;
    private _weightRear: number;
    private _lights: CarLights;

    private _isAcceleratorPressed: boolean;
    private _speed: Vector3;
    private _isBraking: boolean;
    private _isReversing: boolean;
    private _steeringWheelDirection: number;
    private _initialDirection: Vector3 = new Vector3(0, 0, -1);

    public detectionBox: Mesh;
    public trackPortionIndex: number;

    public constructor(
        private keyBoardService: KeyboardEventHandlerService,
        private _isAI: boolean,
        engine: Engine = new Engine(),
        rearWheel: Wheel = new Wheel(),
        wheelbase: number = CarConfig.DEFAULT_WHEELBASE,
        mass: number = CarConfig.DEFAULT_MASS,
        dragCoefficient: number = CarConfig.DEFAULT_DRAG_COEFFICIENT
    ) {
        super();

        if (wheelbase <= 0) {
            console.error("Wheelbase should be greater than 0.");
            wheelbase = CarConfig.DEFAULT_WHEELBASE;
        }

        if (mass <= 0) {
            console.error("Mass should be greater than 0.");
            mass = CarConfig.DEFAULT_MASS;
        }

        if (dragCoefficient <= 0) {
            console.error("Drag coefficient should be greater than 0.");
            dragCoefficient = CarConfig.DEFAULT_DRAG_COEFFICIENT;
        }

        this._engine = engine;
        this._rearWheel = rearWheel;
        this._wheelbase = wheelbase;
        this._mass = mass;
        this._dragCoefficient = dragCoefficient;

        this.initAttributes();
        if (!this._isAI) {
            this.bindKeys();
        } else {
            this.trackPortionIndex = 0;
        }
    }

    private bindKeys(): void {
        this.keyBoardService.bindFunctionToKeyDown(ACCELERATE_KEYCODE, () => this.accelerate());
        this.keyBoardService.bindFunctionToKeyDown(LEFT_KEYCODE, () => this.steerLeft());
        this.keyBoardService.bindFunctionToKeyDown(BRAKE_KEYCODE, () => this.brake());
        this.keyBoardService.bindFunctionToKeyDown(RIGHT_KEYCODE, () => this.steerRight());

        this.keyBoardService.bindFunctionToKeyUp(ACCELERATE_KEYCODE, () => this.releaseAccelerator());
        this.keyBoardService.bindFunctionToKeyUp(LEFT_KEYCODE, () => this.releaseSteering());
        this.keyBoardService.bindFunctionToKeyUp(BRAKE_KEYCODE, () => this.releaseBrakes());
        this.keyBoardService.bindFunctionToKeyUp(RIGHT_KEYCODE, () => this.releaseSteering());
    }

    private initAttributes(): void {
        this._isBraking = false;
        this._steeringWheelDirection = 0;
        this._weightRear = CarConfig.INITIAL_WEIGHT_DISTRIBUTION;
        this._speed = new Vector3(0, 0, 0);
        this.position.add(new Vector3(0, 0, 0));
        this.detectionBox = this.createDetectionBox();
        this._lights = new CarLights();
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
        this._mesh = await this.load();
        this._mesh.position.add(startPoint);
        this._mesh.setRotationFromAxisAngle(new Vector3(0, 1, 0), rotationAngle);
        this._mesh.add(this._lights);
        this.add(this._mesh);
        this.turnLightsOff();
        this._lights.turnBackLightsOff();
    }

    public get isAI(): boolean {
        return this._isAI;
    }

    public get speed(): Vector3 {
        return this._speed.clone();
    }

    public get currentGear(): number {
        return this._engine.currentGear;
    }

    public get rpm(): number {
        return this._engine.rpm;
    }

    public get angle(): number {
        return this._mesh.rotation.y * RAD_TO_DEG;
    }

    public get currentPosition(): Vector3 {
        return this._mesh.position;
    }

    public getChild(childName: string): Object3D {
        return this._mesh.getObjectByName(childName);
    }

    public attachCamera(camera: Camera): void {
        this._mesh.add(camera);
    }

    public turnLightsOn(): void {
        this._lights.turnOn();
        this._lights.turnBackLightsOff();
    }

    public turnLightsOff(): void {
        this._lights.turnOff();
    }

    public releaseBrakes(): void {
        this._isBraking = false;
        this._lights.turnBackLightsOff();
    }

    public steerLeft(): void {
        this._steeringWheelDirection = CarConfig.MAXIMUM_STEERING_ANGLE;
    }

    public steerRight(): void {
        this._steeringWheelDirection = -CarConfig.MAXIMUM_STEERING_ANGLE;
    }

    public releaseSteering(): void {
        this._steeringWheelDirection = 0;
    }

    public brake(): void {
        this._isBraking = true;
        this._lights.turnBackLightsOn();
    }

    public reverse(): void {
        this._isReversing = true;
    }

    public releaseReverse(): void {
        this._isReversing = false;
    }

    public accelerate(): void {
        this._isAcceleratorPressed = true;
    }

    public releaseAccelerator(): void {
        this._isAcceleratorPressed = false;
    }

    public get direction(): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        const carDirection: Vector3 = this._initialDirection.clone();

        rotationMatrix.extractRotation(this._mesh.matrix);
        carDirection.applyMatrix4(rotationMatrix);

        return carDirection;
    }

    public update(deltaTime: number): void {
        deltaTime = deltaTime / MS_TO_SECONDS;

        // Move to car coordinates
        const rotationMatrix: Matrix4 = new Matrix4();
        rotationMatrix.extractRotation(this._mesh.matrix);
        const rotationQuaternion: Quaternion = new Quaternion();
        rotationQuaternion.setFromRotationMatrix(rotationMatrix);
        this._speed.applyMatrix4(rotationMatrix);
        this.physicsUpdate(deltaTime);

        // Move back to world coordinates
        this._speed = this.speed.applyQuaternion(rotationQuaternion.inverse());

        // Angular rotation of the car
        const R: number = CarConfig.DEFAULT_WHEELBASE / Math.sin(this._steeringWheelDirection * deltaTime);
        const omega: number = this._speed.length() / R;
        this._mesh.rotateY(omega);
    }

    private physicsUpdate(deltaTime: number): void {
        Physics.car = this;
        this._rearWheel.angularVelocity += Physics.getAngularAcceleration() * deltaTime;
        this._engine.update(this._speed.length(), this._rearWheel.radius);
        this._weightRear = Physics.getWeightDistribution();
        this._speed.add(Physics.getDeltaSpeed(deltaTime));
        this._speed.setLength(this._speed.length() <= CarConfig.MINIMUM_SPEED ? 0 : this._speed.length());
        this._mesh.position.add(Physics.getDeltaPosition(deltaTime));
        this._rearWheel.update(this._speed.length());
    }

    private createDetectionBox(): Mesh {
        const geometry: BoxGeometry = new BoxGeometry(2, 2, 2);
        geometry.computeBoundingBox();
        const material: MeshBasicMaterial = new MeshBasicMaterial({ color: 0xFFF000 });

        return new Mesh(geometry, material);
    }

    public get rearWheel(): Wheel {
        return this._rearWheel;
    }

    public get wheelbase(): number {
        return this._wheelbase;
    }

    public get mass(): number {
        return this._mass;
    }

    public get engine(): Engine {
        return this._engine;
    }

    public get isAcceleratorPressed(): boolean {
        return this._isAcceleratorPressed;
    }

    public get isBraking(): boolean {
        return this._isBraking;
    }

    public get isReversing(): boolean {
        return this._isReversing;
    }

    public get dragCoefficient(): number {
        return this._dragCoefficient;
    }

    public get weightRear(): number {
        return this._weightRear;
    }
}
