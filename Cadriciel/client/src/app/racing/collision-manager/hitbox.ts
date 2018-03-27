import { Mesh, MeshBasicMaterial, Vector3, BoxGeometry } from "three";

const WIDTH: number = 1.5;
const HEIGHT: number = 0.01;
const DEPTH: number = 3.1;

const TOP_LEFT_VERTEX_INDEX: number = 2;
const TOP_RIGHT_VERTEX_INDEX: number = 3;
const BOTTOM_LEFT_VERTEX_INDEX: number = 6;
const BOTTOM_RIGHT_VERTEX_INDEX: number = 7;

export class Hitbox extends Mesh {

    private _bottomPlaneVertices: Vector3[];
    public inCollision: boolean;

    public constructor() {
        const geometry: BoxGeometry = new BoxGeometry(WIDTH, HEIGHT, DEPTH);
        const material: MeshBasicMaterial = new MeshBasicMaterial({wireframe: true, color: 0x00FF00 });
        material.opacity = 0;
        material.transparent = true;
        super(geometry, material);
        this._bottomPlaneVertices = [];
        this.generateSubPlanVertices();
        this.inCollision = false;
    }

    private generateSubPlanVertices(): void {
        this._bottomPlaneVertices = [];
        this._bottomPlaneVertices.push((this.geometry as BoxGeometry).vertices[TOP_LEFT_VERTEX_INDEX]);
        this._bottomPlaneVertices.push((this.geometry as BoxGeometry).vertices[TOP_RIGHT_VERTEX_INDEX]);
        this._bottomPlaneVertices.push((this.geometry as BoxGeometry).vertices[BOTTOM_LEFT_VERTEX_INDEX]);
        this._bottomPlaneVertices.push((this.geometry as BoxGeometry).vertices[BOTTOM_RIGHT_VERTEX_INDEX]);
    }

    public get bottomPlaneVertices(): Vector3[] {
        return this._bottomPlaneVertices;
    }

    public get hitboxGeometry(): BoxGeometry {
        return this.geometry as BoxGeometry;
    }
}
