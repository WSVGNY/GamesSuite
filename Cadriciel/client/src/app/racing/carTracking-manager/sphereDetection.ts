import { Vector3, Sphere } from "three";
import { TRACKING_SPHERE_RADIUS } from "../constants";

export class TrackingSphere extends Sphere {

    public isDetected: boolean;

    public constructor(center: Vector3) {
        super(center, TRACKING_SPHERE_RADIUS);
        this.isDetected = false;
    }
}
