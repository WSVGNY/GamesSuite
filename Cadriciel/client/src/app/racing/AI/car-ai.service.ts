import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { CommandController } from "../commandController";
import { GoFoward } from "../commands/carAICommands/goFoward";
import { TurnLeft } from "../commands/carAICommands/turnLeft";
// import { Track } from "../../../../../common/racing/track";
import { Vector3, Raycaster, Scene, Intersection, LineBasicMaterial, Geometry, Line } from "three";

@Injectable()
export class CarAiService {
    private readonly DISTANCE_RAYCASTER_FROM_VEHICULE: number = 5;

    private _aiControl: CommandController;
    private _isGoingForward: boolean = false;
    private _isSteeringLeft: boolean = false;
    // private _isSteeringRight: boolean = false;
    // private _isBraking: boolean = false;
    public _scene: Scene;
    private _vectorTrack: {a: number, b: number, c: number}[];
    private _visibleRay: Line;

    // public constructor(private _car: Car, private _track: Track) {
    public constructor(private _car: Car, track: Vector3[]) {
        this._aiControl = new CommandController();
        this.createVectorTrackFromPoints(track);
        this.getPointDistanceFromTrack(0, new Vector3(-550, 0, 170));
    }

    public update(): void {
        if (this._scene === undefined) {
            return;
        }

        this.projectInFrontOfCar();

        if (!this._isGoingForward) {
            this.goForward();
        }

        if (!this._isSteeringLeft) {
            this.goLeft();
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
            const vec: Vector3 = new Vector3(track[i + 1].x - track[i].x, 0 , track[i + 1].y - track[i].y);
            const a: number = vec.x;
            const b: number = vec.z;
            const c: number = track[i].y - ((b / a) * track[i].x);
            this._vectorTrack.push({a, b, c});
            // console.log(this._vectorTrack[i]);
        }
    }

    private getPointDistanceFromTrack(trackPortionIndex: number, point: Vector3): number {
        // console.log(this._vectorTrack[trackPortionIndex]);
        const line: {a: number, b: number, c: number} = this._vectorTrack[trackPortionIndex];
        const top: number = Math.abs(line.a * point.x + line.b * point.z + line.c);
        const bottom: number = Math.sqrt(line.a * line.a + line.b * line.b);

        // console.log(top / bottom);

        return top / bottom;
    }

}
