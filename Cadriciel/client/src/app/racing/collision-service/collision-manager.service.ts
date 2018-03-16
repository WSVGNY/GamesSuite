import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { Mesh, SphereGeometry, MeshBasicMaterial } from "three";

@Injectable()
export class CollisionManagerService {

  public constructor() { }

  public detectCollision(car1: Car, car2: Car): boolean {
    const car1Detection: Mesh = this.createDetectionSphere();
    const car2Detection: Mesh = this.createDetectionSphere();
    car1.add(car1Detection);
    car2.add(car2Detection);
    if (car1Detection.geometry.boundingSphere.intersectsSphere(car2Detection.geometry.boundingSphere)) {
      car1.remove(car1Detection);
      car2.remove(car2Detection);

      return true;
    } else {
      car1.remove(car1Detection);
      car2.remove(car2Detection);

      return false;
    }
  }

  private createDetectionSphere(): Mesh {
    const geometry: SphereGeometry = new SphereGeometry(3, 3, 3);
    geometry.computeBoundingSphere();
    const material: MeshBasicMaterial = new MeshBasicMaterial({ color: 0xffff00 });

    return new Mesh(geometry, material);
  }
}
