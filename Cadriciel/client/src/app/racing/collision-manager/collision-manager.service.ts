import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { CarCollisionManager } from "./carCollision-manager";
import { TrackMesh } from "../track/track";
import { WallCollisionManager } from "./wallCollision-manager";

@Injectable()
export class CollisionManagerService {

    public shouldPlaySound: boolean;

    public constructor() {
        this.shouldPlaySound = false;
    }

    public set track(track: TrackMesh) {
        WallCollisionManager.track = track;
    }

    public update(cars: Car[]): void {
        this.shouldPlaySound = CarCollisionManager.update(cars);
        WallCollisionManager.update(cars);
    }

    public get inCollision(): boolean {
        return this.shouldPlaySound;
    }
}
