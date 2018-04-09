import { Vector3 } from "three";
import { GRAVITY, TIRE_ASPHALT_COEFFICIENT } from "../constants";
import { CarConfig } from "./carConfig";
import { Car } from "./car";

export class Physics {

    private static _car: Car;

    public static set car(car: Car) {
        this._car = car;
    }

    public static getAngularAcceleration(): number {
        return this.getTotalTorque() / (this._car.rearWheel.inertia * CarConfig.NUMBER_REAR_WHEELS);
    }

    public static getDeltaSpeed(deltaTime: number): Vector3 {
        return this.getAcceleration().multiplyScalar(deltaTime);
    }

    public static getWeightDistribution(): number {
        const acceleration: number = this.getAcceleration().length();
        /* tslint:disable:no-magic-numbers */
        const distribution: number =
            this._car.mass + (1 / this._car.wheelbase) * this._car.mass * acceleration / 2;

        return Math.min(Math.max(0.25, distribution), 0.75);
        /* tslint:enable:no-magic-numbers */
    }

    public static getDeltaPosition(deltaTime: number): Vector3 {
        return this._car.speed.multiplyScalar(deltaTime);
    }

    private static getBrakeForce(): Vector3 {
        return this._car.direction.multiplyScalar(this._car.rearWheel.frictionCoefficient * this._car.mass * GRAVITY);
    }

    private static getBrakeTorque(): number {
        return this.getBrakeForce().length() * this._car.rearWheel.radius;
    }

    private static getTractionTorque(): number {
        return this.getTractionForce() * this._car.rearWheel.radius;
    }

    private static getTotalTorque(): number {
        return this.getTractionTorque() * CarConfig.NUMBER_REAR_WHEELS + this.getBrakeTorque();
    }

    private static getEngineForce(): number {
        return this._car.engine.getDriveTorque() / this._car.rearWheel.radius;
    }

    private static getAcceleration(): Vector3 {
        return this.getLongitudinalForce().divideScalar(this._car.mass);
    }

    private static getLongitudinalForce(): Vector3 {
        const resultingForce: Vector3 = new Vector3();

        if (this._car.speed.length() >= CarConfig.MINIMUM_SPEED) {
            const dragForce: Vector3 = this.getDragForce();
            const friction: Vector3 = this.getFrictionForce();
            const rollingResistance: Vector3 = this.getRollingResistance();
            resultingForce.add(dragForce).add(rollingResistance).add(friction);
        }

        if (this._car.isAcceleratorPressed) {
            const tractionForce: number = this.getTractionForce();
            const accelerationForce: Vector3 = this._car.direction;
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce);
        } else if (this._car.isBraking && this.isGoingForward()) {
            const brakeForce: Vector3 = this.getBrakeForce();
            resultingForce.add(brakeForce);
        } else if (this._car.isReversing) {
            const tractionForce: number = this.getTractionForce();
            const accelerationForce: Vector3 = this._car.direction;
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce.clone().multiplyScalar(-1));
        }

        return resultingForce;
    }

    private static getRollingResistance(): Vector3 {
        const tirePressure: number = 1;
        // formula taken from: https://www.engineeringtoolbox.com/rolling-friction-resistance-d_1303.html
        // tslint:disable-next-line:no-magic-numbers
        const rollingCoefficient: number = (1 / tirePressure) * (Math.pow(this._car.speed.length() * 3.6 / 100, 2) * 0.0095 + 0.01) + 0.005;

        return this._car.direction.multiplyScalar(rollingCoefficient * this._car.mass * GRAVITY);
    }

    private static getFrictionForce(): Vector3 {
        const kineticFriction: Vector3 = new Vector3();
        kineticFriction.x = this._car.direction.z;
        kineticFriction.z = -this._car.direction.x;
        const force: Vector3 = this._car.speed.clone().projectOnVector(kineticFriction);
        force.multiplyScalar(TIRE_ASPHALT_COEFFICIENT * this._car.mass * GRAVITY);

        return force;
    }

    private static getDragForce(): Vector3 {
        const carSurface: number = 3;
        const airDensity: number = 1.2;
        const resistance: Vector3 = this._car.direction;
        resistance.multiplyScalar(
            airDensity * carSurface * -this._car.dragCoefficient * this._car.speed.length() * this._car.speed.length());

        return resistance;
    }

    private static isGoingForward(): boolean {
        // tslint:disable-next-line:no-magic-numbers
        return this._car.speed.normalize().dot(this._car.direction) > 0.05;
    }

    private static getTractionForce(): number {
        const force: number = this.getEngineForce();
        const maxForce: number =
            this._car.rearWheel.frictionCoefficient * this._car.mass *
            GRAVITY * this._car.weightRear * CarConfig.NUMBER_REAR_WHEELS / CarConfig.NUMBER_WHEELS;

        return -Math.min(force, maxForce);
    }
}
