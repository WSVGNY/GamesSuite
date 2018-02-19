import { Vector3, Scene, LineBasicMaterial, Geometry, Line } from "three";

export class VectorHelper {

    private visual: Line;
    private material: LineBasicMaterial;

    public constructor(lineColor: number) {
        this.visual = new Line();
        this.material = new LineBasicMaterial({ color: lineColor });
    }

    public update(origin: Vector3, destination: Vector3, scene: Scene): void {
        scene.remove(this.visual);
        const geometry: Geometry = new Geometry();
        geometry.vertices.push(origin);
        geometry.vertices.push(destination);
        this.visual = new Line(geometry, this.material);
        scene.add(this.visual);
    }
}
