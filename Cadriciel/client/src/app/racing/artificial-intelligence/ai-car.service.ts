import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { CommandController } from "../commands/commandController";
import { TurnLeft } from "../commands/carAICommands/turnLeft";
import { TurnRight } from "../commands/carAICommands/turnRight";
import { GoFoward } from "../commands/carAICommands/goFoward";
import { ReleaseSteering } from "../commands/carAICommands/releaseSteering";
import { Vector3 } from "three";
import { SQUARED } from "../constants";
import { Difficulty } from "../../../../../common/crossword/difficulty";
import { AIConfig } from "./ai-config";
import { AIDebug } from "./ai-debug";
import { LineEquation } from "./lineEquation";

@Injectable()
export class AICarService {

    private _aiControl: CommandController;
    private _trackLineEquations: LineEquation[];
    private _aiConfig: AIConfig;
    private _trackVertices: Vector3[];

    public constructor() { }

    public async initialize(trackVertices: Vector3[], difficulty: Difficulty): Promise<void> {
        this._aiControl = new CommandController();
        this._trackVertices = trackVertices;
        this.createVectorTrackFromPoints(trackVertices);
        this._aiConfig = new AIConfig(difficulty);
    }

    public update(car: Car, aiDebug: AIDebug): void {
        const carPosition: Vector3 = new Vector3(
            car.position.x + car.currentPosition.x, 0,
            car.position.z + car.currentPosition.z);

        const projection: Vector3 = this.projectInFrontOfCar(car);
        const lineDistance: number = this.getPointDistanceFromTrack(car, projection);
        const pointOnLine: Vector3 = this.projectPointOnLine(car, projection);
        const turningPoint: Vector3 = this.projectTurningPoint(car);

        aiDebug.updateDebugMode(carPosition, projection, pointOnLine, turningPoint, this._trackVertices[car.trackPortionIndex]);

        this.updateTrackPortionIndex(car, pointOnLine, turningPoint);
        this.updateCarDirection(lineDistance, car);
    }

    private updateTrackPortionIndex(car: Car, pointOnLine: Vector3, turningPoint: Vector3): void {
        if (this.carPassedTrackPortionEnd(car, pointOnLine, turningPoint)) {
            if (car.trackPortionIndex + 1 >= this._trackLineEquations.length) {
                car.trackPortionIndex = 0;
            } else {
                car.trackPortionIndex++;
            }
        }
    }

    private carPassedTrackPortionEnd(car: Car, pointOnLine: Vector3, turningPoint: Vector3): boolean {
        const pointOnLineToTurningPoint: Vector3 = pointOnLine.clone().sub(turningPoint);
        const directorVector: Vector3 = car.trackPortionIndex + 1 === this._trackVertices.length ?
            this._trackLineEquations[0].initialPoint.clone()
                .sub(this._trackLineEquations[car.trackPortionIndex].initialPoint) :
            this._trackLineEquations[car.trackPortionIndex + 1].initialPoint.clone()
                .sub(this._trackLineEquations[car.trackPortionIndex].initialPoint);

        return pointOnLineToTurningPoint.dot(directorVector) > 0;
    }

    private updateCarDirection(lineDistance: number, car: Car): void {
        if (Math.abs(lineDistance) > this._aiConfig.distanceBeforeReplacement) {
            this.accelerate(car);
            if (lineDistance < 0) {
                this.goLeft(car);
            } else {
                this.goRight(car);
            }
        } else {
            this.goForward(car);
        }
    }

    private goForward(car: Car): void {
        this.accelerate(car);
        this.releaseSteering(car);
    }

    private accelerate(car: Car): void {
        this._aiControl.command = new GoFoward(car);
        this._aiControl.execute();
    }

    private goLeft(car: Car): void {
        this._aiControl.command = new TurnLeft(car);
        this._aiControl.execute();
    }

    private goRight(car: Car): void {
        this._aiControl.command = new TurnRight(car);
        this._aiControl.execute();
    }

    private releaseSteering(car: Car): void {
        this._aiControl.command = new ReleaseSteering(car);
        this._aiControl.execute();
    }

    private projectInFrontOfCar(car: Car): Vector3 {
        const dir: Vector3 = car.direction.normalize();
        const positionInFront: Vector3 = new Vector3(
            car.position.x + car.currentPosition.x, 0,
            car.position.z + car.currentPosition.z);
        positionInFront.x += dir.x * this._aiConfig.distanceFromVehicule;
        positionInFront.z += dir.z * this._aiConfig.distanceFromVehicule;

        return positionInFront;
    }

    private createVectorTrackFromPoints(track: Vector3[]): void {
        this._trackLineEquations = [];
        for (let i: number = 0; i < track.length; ++i) {
            const nextVertex: Vector3 = i === track.length - 1 ? track[0] : track[i + 1];
            const a: number = track[i].x - nextVertex.x;
            const b: number = nextVertex.z - track[i].z;
            const c: number = track[i].z * nextVertex.x - nextVertex.z * track[i].x;
            const line: LineEquation = new LineEquation(a, b, c, track[i]);
            this._trackLineEquations.push(line);
        }
    }

    private getPointDistanceFromTrack(car: Car, point: Vector3): number {
        const line: LineEquation = this._trackLineEquations[car.trackPortionIndex];
        const top: number = line.a * point.z + line.b * point.x + line.c;
        const bottom: number = Math.sqrt(line.a * line.a + line.b * line.b);

        return top / bottom;
    }

    private projectPointOnLine(car: Car, point: Vector3): Vector3 {
        const line: LineEquation = this._trackLineEquations[car.trackPortionIndex];
        const a: number = -this._trackLineEquations[car.trackPortionIndex].b;
        const b: number = this._trackLineEquations[car.trackPortionIndex].a;
        const c: number = -a * point.z - b * point.x;
        const pointOnLine: Vector3 = new Vector3();

        pointOnLine.x = b !== 0 ? (line.c * a - line.a * c) / (line.a * b - a * line.b) : this._trackVertices[car.trackPortionIndex].x;
        pointOnLine.z = a !== 0 ? (-c - b * pointOnLine.x) / a : this._trackVertices[car.trackPortionIndex].z;

        return pointOnLine;
    }

    private projectTurningPoint(car: Car): Vector3 {
        const nextPoint: Vector3 = car.trackPortionIndex === this._trackVertices.length - 1 ?
            this._trackVertices[0] :
            this._trackVertices[car.trackPortionIndex + 1];

        const currentPoint: Vector3 = this._trackVertices[car.trackPortionIndex];

        const dx: number = (nextPoint.x - currentPoint.x) / Math.sqrt(Math.pow(nextPoint.x, SQUARED) + Math.pow(currentPoint.x, SQUARED));
        const dz: number = (nextPoint.z - currentPoint.z) / Math.sqrt(Math.pow(nextPoint.z, SQUARED) + Math.pow(currentPoint.z, SQUARED));

        return new Vector3(
            (nextPoint.x + dx * AIConfig.TURNING_POINT_DISTANCE), 0,
            (nextPoint.z + dz * AIConfig.TURNING_POINT_DISTANCE));
    }
}
