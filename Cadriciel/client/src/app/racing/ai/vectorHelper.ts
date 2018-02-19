import { Vector3, Scene, LineBasicMaterial, Geometry, Line } from "three";
import { PINK } from "../constants";

const SIMPLE_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial({ color: PINK });

export class VectorHelper {

    private visual: Line;

    public constructor() {
        this.visual = new Line();
    }

    public update(origin: Vector3, destination: Vector3, scene: Scene): void {
        scene.remove(this.visual);
        const geometry: Geometry = new Geometry();
        geometry.vertices.push(origin);
        geometry.vertices.push(destination);
        this.visual = new Line(geometry, SIMPLE_LINE_MATERIAL);
        scene.add(this.visual);
    }
}
