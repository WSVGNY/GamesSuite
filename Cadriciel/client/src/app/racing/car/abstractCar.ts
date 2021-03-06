import { Object3D, Vector3, ObjectLoader, Matrix4, Quaternion, Camera } from "three";
import { Hitbox } from "../collision-manager/hitbox";
import { CarStructure } from "./carStructure";
import { CarControls } from "./carControls";
import {
    DEFAULT_MASS, DEFAULT_WHEELBASE, DEFAULT_DRAG_COEFFICIENT,
    INITIAL_WEIGHT_DISTRIBUTION, MINIMUM_SPEED, MAXIMUM_STEERING_ANGLE
} from "../constants/car.constants";
import { CarLights } from "./carLights";
import { CAR_TEXTURE } from "../constants/texture.constants";
import { RAD_TO_DEG, SECONDS_TO_MS } from "../constants/math.constants";
import { Physics } from "./physics";
import { Engine } from "./engine";
import { Wheel } from "./wheel";
import { RaceProgressTracker } from "../tracking-service/raceProgressTracker";

export abstract class AbstractCar extends Object3D {
    private _mesh: Object3D;
    private _hitbox: Hitbox;
    private _raceProgressTracker: RaceProgressTracker;

    public constructor(
        private _id: number,
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

    private async load(): Promise<Object3D> {
        return new Promise<Object3D>((resolve, reject) => {
            const loader: ObjectLoader = new ObjectLoader();
            loader.load(CAR_TEXTURE, (object: Object3D) => {
                resolve(object);
            });
        });
    }

    public rotateMesh(axis: Vector3, angle: number): void {
        this._mesh.rotateOnAxis(axis, angle);
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

    public update(deltaTime: number): void {
        deltaTime = deltaTime / SECONDS_TO_MS;

        // Move to car coordinates
        const rotationMatrix: Matrix4 = new Matrix4();
        rotationMatrix.extractRotation(this._mesh.matrix);
        const rotationQuaternion: Quaternion = new Quaternion();
        rotationQuaternion.setFromRotationMatrix(rotationMatrix);
        this._carControls.speed.applyMatrix4(rotationMatrix);
        this.physicsUpdate(deltaTime);

        // Move back to world coordinates
        this._carControls.speed = this.speed.applyQuaternion(rotationQuaternion.inverse());

        // Angular rotation of the car
        const R: number = DEFAULT_WHEELBASE / Math.sin(this._carControls.steeringWheelDirection * deltaTime);
        const omega: number = this._carControls.speed.length() / R;
        this._mesh.rotateY(omega);

        // Hitbox global position
        this._hitbox.updatePosition(this._mesh.position, this._mesh.matrix);
    }

    private physicsUpdate(deltaTime: number): void {
        Physics.car = this;
        this._carStructure.rearWheel.angularVelocity += Physics.getAngularAcceleration() * deltaTime;
        this._carStructure.engine.update(this._carControls.speed.length(), this._carStructure.rearWheel.radius);
        this._carStructure.weightRear = Physics.getWeightDistribution();
        this._carControls.speed.add(Physics.getDeltaSpeed(deltaTime));
        this._carControls.speed.setLength(this._carControls.speed.length() <= MINIMUM_SPEED ?
            0 : this._carControls.speed.length());
        this._mesh.position.add(Physics.getDeltaPosition(deltaTime));
        this._carStructure.rearWheel.update(this._carControls.speed.length());
    }

    public get direction(): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        const carDirection: Vector3 = this._carControls.initialDirection.clone();
        rotationMatrix.extractRotation(this._mesh.matrix);
        carDirection.applyMatrix4(rotationMatrix);

        return carDirection;
    }

    public attachCamera(camera: Camera): void {
        this._mesh.add(camera);
    }

    public turnLightsOn(): void {
        this._carStructure.lights.turnOn();
        this._carStructure.lights.turnBackLightsOff();
    }

    public turnLightsOff(): void {
        this._carStructure.lights.turnOff();
    }

    public get uniqueid(): number {
        return this._id;
    }

    public get speed(): Vector3 {
        return this._carControls.speed.clone();
    }

    public set speed(speed: Vector3) {
        this._carControls.speed = speed;
    }

    public get currentGear(): number {
        return this._carStructure.engine.currentGear;
    }

    public get rpm(): number {
        return this._carStructure.engine.rpm;
    }

    public get angle(): number {
        return this._mesh.rotation.y * RAD_TO_DEG;
    }

    public get meshMatrix(): Matrix4 {
        return this._mesh.matrix;
    }

    public get currentPosition(): Vector3 {
        return this._mesh.position;
    }

    public setCurrentPosition(position: Vector3): void {
        this._mesh.position.set(position.x, position.y, position.z);
    }

    public get hitbox(): Hitbox {
        return this._hitbox;
    }

    public get raceProgressTracker(): RaceProgressTracker {
        return this._raceProgressTracker;
    }

    public getChild(childName: string): Object3D {
        return this._mesh.getObjectByName(childName);
    }

    public get rearWheel(): Wheel {
        return this._carStructure.rearWheel;
    }

    public get wheelbase(): number {
        return this._carStructure.wheelbase;
    }

    public get mass(): number {
        return this._carStructure.mass;
    }

    public get engine(): Engine {
        return this._carStructure.engine;
    }

    public get dragCoefficient(): number {
        return this._carStructure.dragCoefficient;
    }

    public get weightRear(): number {
        return this._carStructure.weightRear;
    }

    public releaseBrakes(): void {
        this._carControls.isBraking = false;
        this._carStructure.lights.turnBackLightsOff();
    }

    public steerLeft(): void {
        this._carControls.steeringWheelDirection = MAXIMUM_STEERING_ANGLE;
    }

    public steerRight(): void {
        this._carControls.steeringWheelDirection = - MAXIMUM_STEERING_ANGLE;
    }

    public releaseSteering(): void {
        this._carControls.steeringWheelDirection = 0;
    }

    public brake(): void {
        this._carControls.isBraking = true;
        this._carStructure.lights.turnBackLightsOn();
    }

    public reverse(): void {
        this._carControls.isReversing = true;
    }

    public releaseReverse(): void {
        this._carControls.isReversing = false;
    }

    public accelerate(): void {
        this._carControls.isAcceleratorPressed = true;
    }

    public releaseAccelerator(): void {
        this._carControls.isAcceleratorPressed = false;
    }

    public get isAcceleratorPressed(): boolean {
        return this._carControls.isAcceleratorPressed;
    }

    public get isBraking(): boolean {
        return this._carControls.isBraking;
    }

    public get isReversing(): boolean {
        return this._carControls.isReversing;
    }
}
