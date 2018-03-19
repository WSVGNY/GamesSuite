import { Mesh, /*BoxGeometry,*/ MeshBasicMaterial, Vector3, PlaneGeometry } from "three";

const WIDTH: number = 1.5;
// const HEIGHT: number = 0.01;
const DEPTH: number = 3.1;

export class Hitbox extends Mesh {

    public constructor() {
        const geometry: PlaneGeometry = new PlaneGeometry(WIDTH, DEPTH);
        geometry.verticesNeedUpdate = true;
        // geometry.applyMatrix();
        const material: MeshBasicMaterial = new MeshBasicMaterial({wireframe: true, color: 0x00FF00 });
        super(geometry, material);
        (this.geometry as PlaneGeometry).verticesNeedUpdate = true;
        console.log((this.geometry as PlaneGeometry).vertices);
    }

    public get vertices(): Vector3[] {
        return (this.geometry as PlaneGeometry).vertices;
    }
}
