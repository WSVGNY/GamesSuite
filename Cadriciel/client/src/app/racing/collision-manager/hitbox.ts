import { Mesh, MeshBasicMaterial, Vector3, BoxGeometry } from "three";

const WIDTH: number = 1.5;
const HEIGHT: number = 0.01;
const DEPTH: number = 3.1;

export class Hitbox extends Mesh {

    private _subPlaneVertices: Vector3[];
    public inCollision: boolean;

    public constructor() {
        const geometry: BoxGeometry = new BoxGeometry(WIDTH, HEIGHT, DEPTH);
        const material: MeshBasicMaterial = new MeshBasicMaterial({wireframe: true, color: 0x00FF00 });
        material.opacity = 0;
        material.transparent = true;
        super(geometry, material);
        this._subPlaneVertices = [];
        this.generateSubPlanVertices();
        this.inCollision = false;
    }

    private generateSubPlanVertices(): void {
        this._subPlaneVertices = [];
        this._subPlaneVertices.push((this.geometry as BoxGeometry).vertices[2]);
        this._subPlaneVertices.push((this.geometry as BoxGeometry).vertices[3]);
        this._subPlaneVertices.push((this.geometry as BoxGeometry).vertices[6]);
        this._subPlaneVertices.push((this.geometry as BoxGeometry).vertices[7]);
    }

    public get subPlanVertices(): Vector3[] {
        return this._subPlaneVertices;
    }

    public get hitboxGeometry(): BoxGeometry {
        return this.geometry as BoxGeometry;
    }
}
