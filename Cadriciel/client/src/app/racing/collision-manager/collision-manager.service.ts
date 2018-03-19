import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { Vector3, Raycaster, Intersection } from "three";

const MINIMUM_CAR_DISTANCE: number = 5;
@Injectable()
export class CollisionManagerService {

    public constructor() { }

    public computeCollisions(cars: Car[]): void {
        for (let i: number = 0; i < cars.length; ++i) {
            for (let j: number = i + 1; j < cars.length; ++j) {
                if (cars[i].currentPosition.distanceTo(cars[j].currentPosition) < MINIMUM_CAR_DISTANCE) {
                    // console.log(cars[i].hitbox.vertices[0].clone().applyMatrix4(cars[i].meshMatrix));
                    for (let vertexIndex: number = 0; vertexIndex < cars[i].hitbox.vertices.length; ++vertexIndex) {
                        const localVertex: Vector3 = cars[i].hitbox.vertices[vertexIndex].clone();
                        const globalVertex: Vector3 = localVertex.applyMatrix4(cars[i].meshMatrix);
                        const direction: Vector3 = globalVertex.sub(cars[i].currentPosition);

                        const ray: Raycaster = new Raycaster(cars[i].currentPosition.clone(), direction.clone().normalize());

                        const collisionResult: Intersection[] = ray.intersectObject(cars[j].hitbox);

                        if (collisionResult.length > 0 && collisionResult[0].distance < direction.length()) {
                            alert("STAY BACK MAN");
                        }
                    }
                }
            }
        }
    }
}
