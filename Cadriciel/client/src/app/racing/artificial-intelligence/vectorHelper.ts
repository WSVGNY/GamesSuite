import { Vector3, LineBasicMaterial, Geometry, Line } from "three";

export class VectorHelper extends Line {

    public constructor(lineColor: number) {
        super();
        this.material = new LineBasicMaterial({ color: lineColor });
    }

    public update(origin: Vector3, destination: Vector3): void {
        this.geometry = new Geometry();
        this.geometry.vertices.push(origin);
        this.geometry.vertices.push(destination);
    }
}
