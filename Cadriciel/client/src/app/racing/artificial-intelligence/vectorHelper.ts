import { Vector3, LineBasicMaterial, Geometry, Line } from "three";

export class VectorHelper {

    public visual: Line;
    private material: LineBasicMaterial;

    public constructor(lineColor: number) {
        this.visual = new Line();
        this.material = new LineBasicMaterial({ color: lineColor });
    }

    public update(origin: Vector3, destination: Vector3): void {
        const geometry: Geometry = new Geometry();
        geometry.vertices.push(origin);
        geometry.vertices.push(destination);
        this.visual = new Line(geometry, this.material);
    }
}
