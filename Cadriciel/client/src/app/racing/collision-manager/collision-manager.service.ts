import { Injectable } from "@angular/core";
import { Car } from "../car/car";

const MINIMUM_CAR_DISTANCE: number = 20;
@Injectable()
export class CollisionManagerService {

    public constructor() { }

    public computeCollisions(cars: Car[]): void {
        for (let i: number = 0; i < cars.length; ++i) {
            for (let j: number = i + 1; j < cars.length; ++j) {
                if (cars[i].currentPosition.distanceTo(cars[j].currentPosition) < MINIMUM_CAR_DISTANCE) {
                        // console.log("too close jack!");
                    }
            }
        }
    }

    // private detectCarCollision(): void {
    //     for (let i: number = 1; i < this._aiCars.length; ++i) {
    //         // this._aiCars[i].detectionShpere.geometry.computeBoundingSphere();
    //         // this._playerCar.detectionShpere.geometry.computeBoundingSphere();
    //         if (this._playerCar.detectionShpere.geometry.boundingSphere.center
    //             !== this._aiCars[i].detectionShpere.geometry.boundingSphere.center) {
    //             if (this._playerCar.detectionShpere.geometry.boundingSphere.center.
    //                 distanceTo(this._aiCars[i].detectionShpere.geometry.boundingSphere.center) < 0.0000001) {
    //                 /*if (this._collisionControl.detectCollision(this._playerCar, this._aiCars[i])) {
    //                     const geometry: BoxGeometry = new BoxGeometry(5, 5, 5);
    //                     geometry.computeBoundingBox();
    //                     const material: MeshBasicMaterial = new MeshBasicMaterial({ color: 0xFF0000 });
    //                     this._playerCar.add(new Mesh(geometry, material));
    //                 }*/
    //                 if (this._sound.isDetected() === true) {
    //                     this._sound.createCollisionSound("../../../assets/sounds/collision-sound.mp3", this._camera, this._playerCar);
    //                 }
    //                 this._sound.play(this._sound.collisionSound);
    //             } else {
    //                 this._sound.collisionSound.stop();
    //             }
    //         }
    //     }
    // }
}
