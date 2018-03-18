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
