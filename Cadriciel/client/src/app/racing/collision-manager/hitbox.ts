import { Mesh, MeshBasicMaterial, Vector3, Geometry, Face3 } from "three";

const WIDTH: number = 1.5;
// const HEIGHT: number = 0.01;
const DEPTH: number = 3.1;

export class Hitbox extends Mesh {

    public constructor() {
        const geometry: Geometry = new Geometry();
        geometry.vertices.push(new Vector3(WIDTH / 2, 0, DEPTH / 2));
        geometry.vertices.push(new Vector3(-WIDTH / 2, 0, DEPTH / 2));
        geometry.vertices.push(new Vector3(-WIDTH / 2, 0, -DEPTH / 2));
        geometry.vertices.push(new Vector3(WIDTH / 2, 0, -DEPTH / 2));
        geometry.faces.push(new Face3(0, 1, 2));
        geometry.faces.push(new Face3(0, 3, 2));
        const material: MeshBasicMaterial = new MeshBasicMaterial({wireframe: true, color: 0x00FF00 });
        super(geometry, material);
    }

    public get vertices(): Vector3[] {
        return (this.geometry as Geometry).vertices;
    }
}
