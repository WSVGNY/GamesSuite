import {
    Vector3, Matrix4, Object3D, ObjectLoader, Quaternion, Camera, Mesh, MeshBasicMaterial, BoxGeometry
} from "three";
import { Engine } from "./engine";
import {
    MS_TO_SECONDS, GRAVITY, RAD_TO_DEG, CAR_TEXTURE, ACCELERATE_KEYCODE, LEFT_KEYCODE, BRAKE_KEYCODE,
    RIGHT_KEYCODE
} from "../constants";
import { Wheel } from "./wheel";
import { CarConfig } from "./carConfig";
import { CarLights } from "./carLights";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";

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
        this.keyBoardService.bindFunctionToKeyDown(ACCELERATE_KEYCODE, () => { this.accelerate(); });
        this.keyBoardService.bindFunctionToKeyDown(LEFT_KEYCODE, () => { this.steerLeft(); });
        this.keyBoardService.bindFunctionToKeyDown(BRAKE_KEYCODE, () => { this.brake(); });
        this.keyBoardService.bindFunctionToKeyDown(RIGHT_KEYCODE, () => { this.steerRight(); });

        this.keyBoardService.bindFunctionToKeyUp(ACCELERATE_KEYCODE, () => { this.releaseAccelerator(); });
        this.keyBoardService.bindFunctionToKeyUp(LEFT_KEYCODE, () => { this.releaseSteering(); });
        this.keyBoardService.bindFunctionToKeyUp(BRAKE_KEYCODE, () => { this.releaseBrakes(); });
        this.keyBoardService.bindFunctionToKeyUp(RIGHT_KEYCODE, () => { this.releaseSteering(); });
    }

    private initAttributes(): void {
        this._isBraking = false;
        this._steeringWheelDirection = 0;
        this._weightRear = CarConfig.INITIAL_WEIGHT_DISTRIBUTION;
        this._speed = new Vector3(0, 0, 0);
        this.position.add(new Vector3(0, 0, 0));
        this.detectionBox = this.createDetectionBox();
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
        this._lights = new CarLights();
        this._mesh.add(this._lights);
        this.add(this._mesh);
        this.dettachLights();
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

    public attachLights(): void {
        this._lights.turnOn();
    }

    public dettachLights(): void {
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
        this._rearWheel.angularVelocity += this.getAngularAcceleration() * deltaTime;
        this._engine.update(this._speed.length(), this._rearWheel.radius);
        this._weightRear = this.getWeightDistribution();
        this._speed.add(this.getDeltaSpeed(deltaTime));
        this._speed.setLength(this._speed.length() <= CarConfig.MINIMUM_SPEED ? 0 : this._speed.length());
        this._mesh.position.add(this.getDeltaPosition(deltaTime));
        this._rearWheel.update(this._speed.length());
    }

    private getWeightDistribution(): number {
        const acceleration: number = this.getAcceleration().length();
        /* tslint:disable:no-magic-numbers */
        const distribution: number =
            this._mass + (1 / this._wheelbase) * this._mass * acceleration / 2;

        return Math.min(Math.max(0.25, distribution), 0.75);
        /* tslint:enable:no-magic-numbers */
    }

    private getLongitudinalForce(): Vector3 {
        const resultingForce: Vector3 = new Vector3();

        if (this._speed.length() >= CarConfig.MINIMUM_SPEED) {
            const dragForce: Vector3 = this.getDragForce();
            const rollingResistance: Vector3 = this.getRollingResistance();
            resultingForce.add(dragForce).add(rollingResistance);
        }

        if (this._isAcceleratorPressed) {
            const tractionForce: number = this.getTractionForce();
            const accelerationForce: Vector3 = this.direction;
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce);
        } else if (this._isBraking && this.isGoingForward()) {
            const brakeForce: Vector3 = this.getBrakeForce();
            resultingForce.add(brakeForce);
        } else if (this._isReversing) {
            const tractionForce: number = this.getTractionForce();
            const accelerationForce: Vector3 = this.direction;
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce.clone().multiplyScalar(-1));
        }

        return resultingForce;
    }

    private getRollingResistance(): Vector3 {
        const tirePressure: number = 1;
        // formula taken from: https://www.engineeringtoolbox.com/rolling-friction-resistance-d_1303.html
        // tslint:disable-next-line:no-magic-numbers
        const rollingCoefficient: number = (1 / tirePressure) * (Math.pow(this.speed.length() * 3.6 / 100, 2) * 0.0095 + 0.01) + 0.005;

        return this.direction.multiplyScalar(rollingCoefficient * this._mass * GRAVITY);
    }

    private getDragForce(): Vector3 {
        const carSurface: number = 3;
        const airDensity: number = 1.2;
        const resistance: Vector3 = this.direction;
        resistance.multiplyScalar(airDensity * carSurface * -this._dragCoefficient * this.speed.length() * this.speed.length());

        return resistance;
    }

    private getTractionForce(): number {
        const force: number = this.getEngineForce();
        const maxForce: number =
            this._rearWheel.frictionCoefficient * this._mass *
            GRAVITY * this._weightRear * CarConfig.NUMBER_REAR_WHEELS / CarConfig.NUMBER_WHEELS;

        return -Math.min(force, maxForce);
    }

    private getAngularAcceleration(): number {
        return this.getTotalTorque() / (this._rearWheel.inertia * CarConfig.NUMBER_REAR_WHEELS);
    }

    private getBrakeForce(): Vector3 {
        return this.direction.multiplyScalar(this._rearWheel.frictionCoefficient * this._mass * GRAVITY);
    }

    private getBrakeTorque(): number {
        return this.getBrakeForce().length() * this._rearWheel.radius;
    }

    private getTractionTorque(): number {
        return this.getTractionForce() * this._rearWheel.radius;
    }

    private getTotalTorque(): number {
        return this.getTractionTorque() * CarConfig.NUMBER_REAR_WHEELS + this.getBrakeTorque();
    }

    private getEngineForce(): number {
        return this._engine.getDriveTorque() / this._rearWheel.radius;
    }

    private getAcceleration(): Vector3 {
        return this.getLongitudinalForce().divideScalar(this._mass);
    }

    private getDeltaSpeed(deltaTime: number): Vector3 {
        return this.getAcceleration().multiplyScalar(deltaTime);
    }

    private getDeltaPosition(deltaTime: number): Vector3 {
        return this.speed.multiplyScalar(deltaTime);
    }

    private isGoingForward(): boolean {
        // tslint:disable-next-line:no-magic-numbers
        return this.speed.normalize().dot(this.direction) > 0.05;
    }

    private createDetectionBox(): Mesh {
        const geometry: BoxGeometry = new BoxGeometry(2, 2, 2);
        geometry.computeBoundingBox();
        const material: MeshBasicMaterial = new MeshBasicMaterial({ color: 0xfff000 });

        return new Mesh(geometry, material);
    }
}
