import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { CarCollisionManager } from "./carCollision-manager";
import { WallCollisionManager } from "./wallCollision-manager";
import { TrackMesh } from "../track/track";

@Injectable()
export class CollisionManagerService {

    public shouldPlaySound: boolean;

    public constructor() {
        this.shouldPlaySound = false;
    }

    public setWalls(track: TrackMesh): void {
        WallCollisionManager.track = track;
    }

    public update(cars: Car[]): void {
        this.shouldPlaySound = CarCollisionManager.update(cars);
    }

    public get inCollision(): boolean {
        return this.shouldPlaySound;
    }

}
