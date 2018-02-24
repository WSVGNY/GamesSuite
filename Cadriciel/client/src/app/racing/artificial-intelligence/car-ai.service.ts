import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { CommandController } from "../commandController";
import { TurnLeft } from "../commands/carAICommands/turnLeft";
import { TurnRight } from "../commands/carAICommands/turnRight";
import { ReleaseSteering } from "../commands/carAICommands/releaseSteering";
import { Vector3, BoxHelper, Group } from "three";
import { VectorHelper } from "./vectorHelper";
import { PINK, WHITE, RED, GREEN, BLUE, SQUARED } from "../constants";
import { Difficulty } from "../../../../../common/crossword/difficulty";
import { Line } from "./line";
import { GoFoward } from "../commands/carAICommands/goFoward";
import { AIConfig } from "./ai-config";

@Injectable()
export class CarAiService {
    private readonly TURNING_POINT_DISTANCE: number = 0.1;
    private readonly START_INDEX: number = 0;
    private readonly TURNING_POINT_BUFFER: number = 2;

    private _debugGroup: Group;

    private _aiControl: CommandController;
    private _trackPortionIndex: number = this.START_INDEX;
    private _trackVectors: Line[];
    private _aiConfig: AIConfig;

    // HELPER
    private _carHelper: BoxHelper;
    private _axisX: VectorHelper;
    private _axisY: VectorHelper;
    private _axisZ: VectorHelper;
    private _carVectorHelper: VectorHelper;
    private _distanceVectorHelper: VectorHelper;
    private _turningVectorHelper: VectorHelper;

    public constructor(private _car: Car, private _trackVertices: Vector3[]/*, public _scene: Scene*/, difficulty: Difficulty) {
        this._aiControl = new CommandController();
        this.createVectorTrackFromPoints(_trackVertices);
        this.initializeDebugMode();
        this._aiConfig = new AIConfig(difficulty);

    }

    // Helper
    private initializeDebugMode(): void {
        this._debugGroup = new Group;
        this._axisX = new VectorHelper(RED);
        this._axisY = new VectorHelper(GREEN);
        this._axisZ = new VectorHelper(BLUE);

        this._carVectorHelper = new VectorHelper(PINK);
        this._distanceVectorHelper = new VectorHelper(WHITE);
        this._turningVectorHelper = new VectorHelper(PINK);
        this._carHelper = new BoxHelper(this._car);

        this._debugGroup.add(this._carHelper);
        this._debugGroup.add(this._axisX.visual);
        this._debugGroup.add(this._axisY.visual);
        this._debugGroup.add(this._axisZ.visual);
        this._debugGroup.add(this._carVectorHelper.visual);
        this._debugGroup.add(this._distanceVectorHelper.visual);
        this._debugGroup.add(this._turningVectorHelper.visual);

    }

    public update(): void {
        const carPosition: Vector3 = new Vector3(
            this._car.position.x + this._car.currentPosition.x, 0,
            this._car.position.z + this._car.currentPosition.z);

        const projection: Vector3 = this.projectInFrontOfCar();
        const lineDistance: number = this.getPointDistanceFromTrack(projection);
        const pointOnLine: Vector3 = this.projectPointOnLine(projection);
        const turningPoint: Vector3 = this.projectTurningPoint();

        this.updateDebugMode(carPosition, projection, pointOnLine, turningPoint);

        this.updateTrackPortionIndex(pointOnLine, turningPoint);
        this.updateCarDirection(lineDistance);
    }

    private updateDebugMode(carPosition: Vector3, projection: Vector3, pointOnLine: Vector3, turningPoint: Vector3): void {
        this._axisX.update(carPosition, carPosition.clone().add(new Vector3(5, 0, 0)));
        this._axisY.update(carPosition, carPosition.clone().add(new Vector3(0, 5, 0)));
        this._axisZ.update(carPosition, carPosition.clone().add(new Vector3(0, 0, 5)));
        this._carHelper.update(this._car);
        this._carVectorHelper.update(carPosition, projection);
        this._distanceVectorHelper.update(projection, pointOnLine);
        this._turningVectorHelper.update(
            new Vector3(
                this._trackVertices[this._trackPortionIndex].x,
                0,
                this._trackVertices[this._trackPortionIndex].z),
            turningPoint
        );
    }

    private updateTrackPortionIndex(pointOnLine: Vector3, turningPoint: Vector3): void {
        if (this._trackVertices[this._trackPortionIndex].distanceTo(pointOnLine) > this.TURNING_POINT_BUFFER &&
            pointOnLine.distanceTo(turningPoint) < this.TURNING_POINT_BUFFER) {

            if (this._trackPortionIndex + 1 >= this._trackVectors.length) {
                this._trackPortionIndex = 0;
            } else {
                this._trackPortionIndex++;
            }
        }
    }

    private updateCarDirection(lineDistance: number): void {
        if (Math.abs(lineDistance) > this._aiConfig.distanceBeforeReplacement) {
            if (lineDistance < 0) {
                this.goLeft();
            } else {
                this.goRight();
            }
        } else {
            this.goForward();
            this.releaseSteering();
        }
    }

    private goForward(): void {
        this._aiControl.command = new GoFoward(this._car);
        this._aiControl.execute();
    }

    private goLeft(): void {
        this._aiControl.command = new TurnLeft(this._car);
        this._aiControl.execute();
    }

    private goRight(): void {
        this._aiControl.command = new TurnRight(this._car);
        this._aiControl.execute();
    }

    private releaseSteering(): void {
        this._aiControl.command = new ReleaseSteering(this._car);
        this._aiControl.execute();
    }

    private projectInFrontOfCar(): Vector3 {
        const dir: Vector3 = this._car.direction.normalize();
        const positionInFront: Vector3 = new Vector3(
            this._car.position.x + this._car.currentPosition.x, 0,
            this._car.position.z + this._car.currentPosition.z);

        positionInFront.x += dir.x * this._aiConfig.distanceFromVehicule;
        positionInFront.z += dir.z * this._aiConfig.distanceFromVehicule;

        return positionInFront;
    }

    private createVectorTrackFromPoints(track: Vector3[]): void {
        this._trackVectors = [];
        for (let i: number = 0; i < track.length; ++i) {
            const nextVertex: Vector3 = i === track.length - 1 ? track[0] : track[i + 1];

            const a: number = track[i].x - nextVertex.x;
            const b: number = nextVertex.z - track[i].z;
            const c: number = track[i].z * nextVertex.x - nextVertex.z * track[i].x;
            const line: Line = new Line(a, b, c);

            this._trackVectors.push(line);
        }
    }

    private getPointDistanceFromTrack(point: Vector3): number {
        const line: Line = this._trackVectors[this._trackPortionIndex];
        const top: number = line.a * point.z + line.b * point.x + line.c;
        const bottom: number = Math.sqrt(line.a * line.a + line.b * line.b);

        return top / bottom;
    }

    private projectPointOnLine(point: Vector3): Vector3 {
        const line: Line = this._trackVectors[this._trackPortionIndex];

        // line equation : az + bx + c = 0
        const a: number = -this._trackVectors[this._trackPortionIndex].b;
        const b: number = this._trackVectors[this._trackPortionIndex].a;
        const c: number = -a * point.z - b * point.x;

        const pointOnLine: Vector3 = new Vector3();
        pointOnLine.x = b !== 0 ? (line.c * a - line.a * c) / (line.a * b - a * line.b) : this._trackVertices[this._trackPortionIndex].x;
        pointOnLine.z = a !== 0 ? (-c - b * pointOnLine.x) / a : this._trackVertices[this._trackPortionIndex].z;

        return pointOnLine;
    }
    private projectTurningPoint(): Vector3 {
        const nextPoint: Vector3 = this._trackPortionIndex === this._trackVertices.length - 1 ?
            this._trackVertices[0] :
            this._trackVertices[this._trackPortionIndex + 1];

        const currentPoint: Vector3 = this._trackVertices[this._trackPortionIndex];

        const dx: number = (nextPoint.x - currentPoint.x) / Math.sqrt(Math.pow(nextPoint.x, SQUARED) + Math.pow(currentPoint.x, SQUARED));
        const dz: number = (nextPoint.z - currentPoint.z) / Math.sqrt(Math.pow(nextPoint.z, SQUARED) + Math.pow(currentPoint.z, SQUARED));

        return new Vector3((nextPoint.x + dx * this.TURNING_POINT_DISTANCE), 0, (nextPoint.z + dz * this.TURNING_POINT_DISTANCE));
    }

    public get debugGroup(): Group {
        return this._debugGroup;
    }
}
