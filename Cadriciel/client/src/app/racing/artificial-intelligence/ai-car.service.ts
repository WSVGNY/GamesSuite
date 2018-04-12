import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { CommandController } from "../commands/commandController";
import { TurnLeft } from "../commands/carAICommands/turnLeft";
import { TurnRight } from "../commands/carAICommands/turnRight";
import { GoFoward } from "../commands/carAICommands/goFoward";
import { ReleaseSteering } from "../commands/carAICommands/releaseSteering";
import { Vector3 } from "three";
import { PI_OVER_4 } from "../constants";
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
        this._trackVertices = [];
        this._trackVertices = trackVertices;
        // trackVertices.forEach((vertex: Vector3) => {
        //     this._trackVertices.push(new Vector3(coordinate.x, coordinate.y, coordinate.z));
        // });
        this.createVectorTrackFromPoints(this._trackVertices);
        this._aiConfig = new AIConfig(difficulty);
    }

    public update(car: Car, aiDebug: AIDebug): void {
        const carPosition: Vector3 = new Vector3(
            car.position.x + car.currentPosition.x, 0,
            car.position.z + car.currentPosition.z);

        const projection: Vector3 = this.projectInFrontOfCar(car);
        const lineDistance: number = this.getPointDistanceFromTrack(car, projection);
        const pointOnLine: Vector3 = this.projectPointOnLine(car, projection);

        aiDebug.updateDebugMode(carPosition, projection, pointOnLine, this._trackVertices[car.trackPortionIndex]);

        this.updateTrackPortionIndex(car, pointOnLine);
        this.updateCarDirection(lineDistance, car, this.isCarGoingStraightToLine(car, projection, pointOnLine));
    }

    private updateTrackPortionIndex(car: Car, pointOnLine: Vector3): void {
        if (this.carPassedTrackPortionEnd(car, pointOnLine)) {
            if (car.trackPortionIndex + 1 >= this._trackLineEquations.length) {
                car.trackPortionIndex = 0;
            } else {
                car.trackPortionIndex++;
            }
        }
    }

    private carPassedTrackPortionEnd(car: Car, pointOnLine: Vector3): boolean {
        let pointOnLineToNextPoint: Vector3;
        let directorVector: Vector3;

        if (car.trackPortionIndex + 1 === this._trackVertices.length) {
            pointOnLineToNextPoint = pointOnLine.clone().sub(this._trackLineEquations[0].initialPoint);
            directorVector = this._trackLineEquations[0].initialPoint.clone()
                .sub(this._trackLineEquations[car.trackPortionIndex].initialPoint);
        } else {
            pointOnLineToNextPoint = pointOnLine.clone().sub(this._trackLineEquations[car.trackPortionIndex + 1].initialPoint);
            directorVector = this._trackLineEquations[car.trackPortionIndex + 1].initialPoint.clone()
                .sub(this._trackLineEquations[car.trackPortionIndex].initialPoint);
        }

        return pointOnLineToNextPoint.dot(directorVector) > 0;
    }

    private updateCarDirection(lineDistance: number, car: Car, goingStraightToLine: boolean): void {
        if (Math.abs(lineDistance) > this._aiConfig.distanceBeforeReplacement && !goingStraightToLine) {
            this.accelerate(car);
            lineDistance < 0 ?
                this.goLeft(car) :
                this.goRight(car);
        } else {
            this.goForward(car);
        }
    }

    private isCarGoingStraightToLine(car: Car, projection: Vector3, pointOnLine: Vector3): boolean {
        const vectorFromProjectionToCar: Vector3 = car.currentPosition.clone().sub(projection).normalize();
        const vectorFromPointOnLineToCar: Vector3 = pointOnLine.clone().sub(projection).normalize();

        return Math.abs(vectorFromProjectionToCar.angleTo(vectorFromPointOnLineToCar)) >= Math.PI - PI_OVER_4;
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
        const positionInFront: Vector3 = new Vector3(car.position.x + car.currentPosition.x, 0, car.position.z + car.currentPosition.z);
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
}
