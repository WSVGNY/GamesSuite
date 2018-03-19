import { Mesh, BoxGeometry, MeshBasicMaterial, Vector3 } from "three";

const WIDTH: number = 1.5;
const HEIGHT: number = 1;
const DEPTH: number = 3.1;

export class Hitbox extends Mesh {

    public constructor() {
        const geometry: BoxGeometry = new BoxGeometry(WIDTH, HEIGHT, DEPTH);
        geometry.computeBoundingSphere();
        const material: MeshBasicMaterial = new MeshBasicMaterial({ color: 0x00FF00 });
        super(geometry, material);
    }

    public get vertices(): Vector3[] {
        return (this.geometry as BoxGeometry).vertices;
    }
}
