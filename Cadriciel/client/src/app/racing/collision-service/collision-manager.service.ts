import { Injectable } from "@angular/core";
import { Car } from "../car/car";

@Injectable()
export class CollisionManagerService {

    public constructor() { }

    public detectCollision(car1: Car, car2: Car): boolean {
        if (car1.detectionBox.geometry.boundingBox.intersectsBox(car2.detectionBox.geometry.boundingBox)) {
            return true;
        } else {
            return false;
        }
    }
}
