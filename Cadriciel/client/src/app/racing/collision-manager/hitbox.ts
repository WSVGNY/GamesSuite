import { Mesh, MeshBasicMaterial, Vector3, BoxGeometry } from "three";
import { GREEN } from "../constants";

const WIDTH: number = 1.5;
const HEIGHT: number = 0.01;
const DEPTH: number = 3.1;

export class Hitbox extends Mesh {

    private _subPlaneVertices: Vector3[];
    public _inCollision: boolean;

    public constructor() {
        const geometry: BoxGeometry = new BoxGeometry(WIDTH, HEIGHT, DEPTH);
        const material: MeshBasicMaterial = new MeshBasicMaterial({ wireframe: true, color: GREEN });
        super(geometry, material);
        this._subPlaneVertices = [];
        this.generateSubPlanVertices();
        this._inCollision = false;
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
}
