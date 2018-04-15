import { Vector3, Matrix4, Object3D, Quaternion, Camera } from "three";
import { Engine } from "./engine";
import { Wheel } from "./wheel";
import { Hitbox } from "../collision-manager/hitbox";
import { Physics } from "./physics";
import { RaceProgressTracker } from "../carTracking-manager/raceProgressTracker";
import { RAD_TO_DEG, MS_TO_SECONDS } from "../constants/math.constants";
import {
    DEFAULT_WHEELBASE, MAXIMUM_STEERING_ANGLE, MINIMUM_SPEED
} from "../constants/car.constants";

export class Car extends Object3D {



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

    public attachCamera(camera: Camera): void {
        this._mesh.add(camera);
    }

    public turnLightsOn(): void {
        this._carStructure.lights.turnOn();
        this._carStructure.lights.turnBackLightsOff();
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

    public get direction(): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        const carDirection: Vector3 = this._carControls.initialDirection.clone();

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

    public get isAcceleratorPressed(): boolean {
        return this._carControls.isAcceleratorPressed;
    }

    public get isBraking(): boolean {
        return this._carControls.isBraking;
    }

    public get isReversing(): boolean {
        return this._carControls.isReversing;
    }

    public get dragCoefficient(): number {
        return this._carStructure.dragCoefficient;
    }

    public get weightRear(): number {
        return this._carStructure.weightRear;
    }
}
