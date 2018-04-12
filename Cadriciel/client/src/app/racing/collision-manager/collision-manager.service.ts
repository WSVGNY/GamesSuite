import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { CarCollisionManager } from "./carCollision-manager";
import { TrackMesh } from "../track/track";
import { WallCollisionManager } from "./wallCollision-manager";
import { SoundManagerService } from "../sound-service/sound-manager.service";

@Injectable()
export class CollisionManagerService {

    public constructor(private soundManager: SoundManagerService) {
    }

    public set track(track: TrackMesh) {
        WallCollisionManager.track = track;
    }

    public update(cars: Car[]): void {
        CarCollisionManager.update(cars, this.soundManager);
        WallCollisionManager.update(cars, this.soundManager);
    }
}
