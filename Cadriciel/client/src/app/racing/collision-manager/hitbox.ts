import { Mesh, MeshBasicMaterial, Vector3, BoxGeometry } from "three";

const WIDTH: number = 1.5;
const HEIGHT: number = 0.01;
const DEPTH: number = 3.1;

export class Hitbox extends Mesh {

    private subPlaneVertices: Vector3[];

    public constructor() {
        const geometry: BoxGeometry = new BoxGeometry(WIDTH, HEIGHT, DEPTH);
        const material: MeshBasicMaterial = new MeshBasicMaterial({wireframe: true, color: 0x00FF00 });
        super(geometry, material);
        this.subPlaneVertices = [];
        this.generateSubPlanVertices();
    }

    private generateSubPlanVertices(): void {
        this.subPlaneVertices = [];
        this.subPlaneVertices.push((this.geometry as BoxGeometry).vertices[2]);
        this.subPlaneVertices.push((this.geometry as BoxGeometry).vertices[3]);
        this.subPlaneVertices.push((this.geometry as BoxGeometry).vertices[6]);
        this.subPlaneVertices.push((this.geometry as BoxGeometry).vertices[7]);
    }

    public get subPlanVertices(): Vector3[] {
        return this.subPlaneVertices;
    }
}
