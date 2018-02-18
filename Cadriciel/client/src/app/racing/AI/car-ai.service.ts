import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { CommandController } from "../commandController";
import { GoFoward } from "../commands/carAICommands/goFoward";
import { TurnLeft } from "../commands/carAICommands/turnLeft";
import { TurnRight} from "../commands/carAICommands/turnRight";
import { ReleaseSteering } from "../commands/carAICommands/releaseSteering";
// import { Track } from "../../../../../common/racing/track";
import { Vector3, Raycaster, Scene, Intersection, LineBasicMaterial, Geometry, Line } from "three";

@Injectable()
export class CarAiService {
    private readonly DISTANCE_RAYCASTER_FROM_VEHICULE: number = 5;

    private _aiControl: CommandController;
    private _isGoingForward: boolean = false;
    private _isSteeringLeft: boolean = false;
    private _isSteeringRight: boolean = false;
    // private _isBraking: boolean = false;
    private _isReleasingSteering: boolean = false;
    public _scene: Scene;
    private _vectorTrack: {a: number, b: number, c: number}[];
    private _visibleRay: Line;
    private _isLeftOfLine: boolean = false;

    // public constructor(private _car: Car, private _track: Track) {
    public constructor(private _car: Car, track: Vector3[]) {
        this._aiControl = new CommandController();
        this.createVectorTrackFromPoints(track);
    }

    public update(): void {
        if (this._scene === undefined) {
            return;
        }

        const projection: Intersection[] = this.projectInFrontOfCar();
        let lineDistance: number;
        if (projection.length !== 0) {
            const pointToVerify: Vector3 = projection[0].point;
            lineDistance = this.getPointDistanceFromTrack(0, pointToVerify);
        }
        //console.log(lineDistance);
        if (lineDistance === undefined) {
            if (!this._isSteeringRight && this._isLeftOfLine) {
                this._isLeftOfLine = !this._isLeftOfLine;
                this.goRight();
            } else {
                if (!this._isSteeringLeft && !this._isLeftOfLine) {
                    this._isLeftOfLine = !this._isLeftOfLine;
                    this.goLeft();
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

    private projectInFrontOfCar(): Intersection[] {
        const dir: Vector3 = this._car.direction.normalize();
        const posRaycaster: Vector3 = new Vector3(this._car.position.x - this._car.currentPosition.x, 0,
                                                  this._car.position.z - this._car.currentPosition.z);

        posRaycaster.x -= dir.x * this.DISTANCE_RAYCASTER_FROM_VEHICULE;
        posRaycaster.y = this.DISTANCE_RAYCASTER_FROM_VEHICULE;
        posRaycaster.z -= dir.z * this.DISTANCE_RAYCASTER_FROM_VEHICULE;

        const raycaster: Raycaster = new Raycaster(posRaycaster, new Vector3(0, -1, 0), 0, this.DISTANCE_RAYCASTER_FROM_VEHICULE + 1);

        // TODO: Remove following code, purely for troubleshooting means
        const material: LineBasicMaterial = new LineBasicMaterial({ color: 0xFFFFFF });
        const material2: LineBasicMaterial = new LineBasicMaterial({ color: 0xFF0000 });
        const geometry: Geometry = new Geometry();
        geometry.vertices.push(posRaycaster);
        geometry.vertices.push(posRaycaster.clone().add(new Vector3(0, -10, 0)));
        this._scene.remove(this._visibleRay);

        const intersects: Intersection[] = raycaster.intersectObjects(this._scene.children);

        if (intersects.length !== 0) {
          this._visibleRay = new Line(geometry, material2);
        } else {
          this._visibleRay = new Line(geometry, material);
        }

        this._scene.add(this._visibleRay);

        return intersects;
    }

    private createVectorTrackFromPoints(track: Vector3[]): void {
        this._vectorTrack = [];
        for (let i: number = 0; i < track.length - 1; ++i) {
            const a: number = track[i].y - track[i + 1].y;
            const b: number = track[i + 1].x - track[i].x;
            const c: number = track[i].x * track[i + 1].y - track[i + 1].x * track[i].y;
            this._vectorTrack.push({a, b, c});
        }
    }

    private getPointDistanceFromTrack(trackPortionIndex: number, point: Vector3): number {
        const line: {a: number, b: number, c: number} = this._vectorTrack[trackPortionIndex];
        const top: number = Math.abs(line.a * point.x + line.b * point.z + line.c);
        const bottom: number = Math.sqrt(line.a * line.a + line.b * line.b);

        return top / bottom;
    }

}
