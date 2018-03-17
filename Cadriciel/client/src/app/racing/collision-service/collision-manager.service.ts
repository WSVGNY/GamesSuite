import { Injectable } from "@angular/core";
import { Car } from "../car/car";

@Injectable()
export class CollisionManagerService {

    public constructor() { }

    public detectCollision(car1: Car, car2: Car): boolean {
        if (car1.detectionShpere.geometry.boundingSphere
        .intersectsSphere(car2.detectionShpere.geometry.boundingSphere)) {
            return true;
        } else {
            return false;
        }
    }
}
