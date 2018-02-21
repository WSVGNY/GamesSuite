import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { CommandController } from "../commandController";
import { GoFoward } from "../commands/carAICommands/goFoward";
import { TurnLeft } from "../commands/carAICommands/turnLeft";
import { TurnRight} from "../commands/carAICommands/turnRight";
import { ReleaseSteering } from "../commands/carAICommands/releaseSteering";
import { Vector3, Scene, BoxHelper } from "three";
import { VectorHelper } from "./vectorHelper";
import { PINK, WHITE } from "../constants";

@Injectable()
export class CarAiService {
    private readonly DISTANCE_FROM_VEHICULE: number = 12;
    private readonly TURNING_POINT_DISTANCE: number = 0.1;
    private readonly DISTANCE_BEFORE_REPLACEMENT: number = 2;
    private readonly START_INDEX: number = 0;

    private _aiControl: CommandController;
    private _isGoingForward: boolean = false;
    private _isSteeringLeft: boolean = false;
    private _isSteeringRight: boolean = false;
    private _isBraking: boolean = false;
    private _isReleasingSteering: boolean = false;
    private _trackPortionIndex: number = this.START_INDEX;
    private _trackVectors: {a: number, b: number, c: number}[];

    // HELPER
    private _helper: BoxHelper;
    private _carVectorHelper: VectorHelper;
    private _distanceVectorHelper: VectorHelper;
    private _turningVectorHelper: VectorHelper;


    public constructor(private _car: Car, private _trackVertices: Vector3[], public _scene: Scene) {
        this._aiControl = new CommandController();
        this.createVectorTrackFromPoints(_trackVertices);

        // HELPER
        this._carVectorHelper = new VectorHelper(PINK);
        this._distanceVectorHelper = new VectorHelper(WHITE);
        this._turningVectorHelper = new VectorHelper(PINK);
        this._helper = new BoxHelper(this._car);
        this._scene.add(this._helper);

    }

    // tslint:disable-next-line:max-func-body-length
    public update(): void {
        // Helper
        this._helper.update(this._car);

        const projection: Vector3 = this.projectInFrontOfCar();
        const lineDistance: number = this.getPointDistanceFromTrack(projection);
        const carPosition: Vector3 = new Vector3(this._car.position.x + this._car.currentPosition.x, 0,
                                                 this._car.position.z + this._car.currentPosition.z);

        const pointOnLine: Vector3 = this.projectPointOnLine(projection);
        const turningPoint: Vector3 = this.projectTurningPoint();

        // Helper
        this._carVectorHelper.update(carPosition, projection, this._scene);
        this._distanceVectorHelper.update(projection, pointOnLine, this._scene);
        this._turningVectorHelper.update(new Vector3(this._trackVertices[this._trackPortionIndex].x, 0,
                                                     this._trackVertices[this._trackPortionIndex].z),
                                         turningPoint, this._scene);

        if ((this._trackVertices[this._trackPortionIndex].distanceTo(pointOnLine) + pointOnLine.distanceTo(turningPoint)) - this._trackVertices[this._trackPortionIndex].distanceTo(turningPoint) < 3) {
            if (this._trackPortionIndex - 1 < 0) {
                this._trackPortionIndex = this._trackVectors.length - 1;
            } else {
                this._trackPortionIndex--;
            }
        }

        if (Math.abs(lineDistance) > this.DISTANCE_BEFORE_REPLACEMENT) {
            if (lineDistance < 0) {
                if (!this._isSteeringLeft) {
                    this.goLeft();
                }
            } else {
                if (!this._isSteeringRight) {
                    this.goRight();
                }
            }
        } else {
            if (!this._isGoingForward) {
                this.goForward();
                this.releaseSteering();
            }
        }
    }

    private goForward(): void {
        this._aiControl.setCommand(new GoFoward(this._car));
        this._aiControl.execute();
        this._isGoingForward = true;
    }

    private goLeft(): void {
        this._aiControl.setCommand(new TurnLeft(this._car));
        this._aiControl.execute();
        this._isSteeringLeft = true;
    }

    private goRight(): void {
        this._aiControl.setCommand(new TurnRight(this._car));
        this._aiControl.execute();
        this._isSteeringRight = true;
    }

    private releaseSteering(): void {
        this._aiControl.setCommand(new ReleaseSteering(this._car));
        this._aiControl.execute();
        this._isReleasingSteering = true;
        this._isSteeringRight = false;
        this._isSteeringLeft = false;
        this._isGoingForward = false;
    }

    private projectInFrontOfCar(): Vector3 {
        const dir: Vector3 = this._car.direction.normalize();
        const positionInFront: Vector3 = new Vector3(this._car.position.x + this._car.currentPosition.x, 0,
                                                     this._car.position.z + this._car.currentPosition.z);

        positionInFront.x += dir.x * this.DISTANCE_FROM_VEHICULE;
        positionInFront.z += dir.z * this.DISTANCE_FROM_VEHICULE;

        return positionInFront;
    }

    private createVectorTrackFromPoints(track: Vector3[]): void {
        this._trackVectors = [];
        for (let i: number = 0; i < track.length; ++i) {
            let nextVertex: number = 1;
            if (i === track.length - 1) {
                nextVertex = -i;
            }
            const a: number = track[i].z - track[i + nextVertex].z;
            const b: number = track[i + nextVertex].x - track[i].x;
            const c: number = track[i].x * track[i + nextVertex].z - track[i + nextVertex].x * track[i].z;
            this._trackVectors.push({a, b, c});
        }
    }

    private getPointDistanceFromTrack(point: Vector3): number {
        const line: {a: number, b: number, c: number} = this._trackVectors[this._trackPortionIndex];
        const top: number = line.a * point.x + line.b * point.z + line.c;
        const bottom: number = Math.sqrt(line.a * line.a + line.b * line.b);

        return top / bottom;
    }

    private projectPointOnLine(point: Vector3): Vector3 {
        const line: {a: number, b: number, c: number} = this._trackVectors[this._trackPortionIndex];
        const pointOnLine: Vector3 = new Vector3();

        const a: number = -this._trackVectors[this._trackPortionIndex].b;
        const b: number = this._trackVectors[this._trackPortionIndex].a;
        const c: number = -a * point.x - b * point.z;

        pointOnLine.z = (line.c * a - line.a * c) / ( line.a * b - a * line.b );
        pointOnLine.x = ( -c - b * pointOnLine.z ) / a;

        return pointOnLine;
    }

    private projectTurningPoint(): Vector3 {
        // const line: {a: number, b: number, c: number} = this._vectorTrack[this._trackPortionIndex];
        let p1: Vector3;
        if (this._trackPortionIndex === this._trackVertices.length - 1) {
            p1 = this._trackVertices[0];
        } else {
            p1 = this._trackVertices[this._trackPortionIndex + 1];
        }
        const p2: Vector3 = this._trackVertices[this._trackPortionIndex];

        const dx: number = p2.x - p1.x;
        const dz: number = p2.z - p1.z;

        const turningPoint: Vector3 = new Vector3();
        turningPoint.x = (p2.x + dx * this.TURNING_POINT_DISTANCE);
        turningPoint.y = 0;
        turningPoint.z = (p2.z + dz * this.TURNING_POINT_DISTANCE);

        return turningPoint;
    }

}
