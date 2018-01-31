import { SphereGeometry, MeshBasicMaterial, Mesh } from "three";

const RED: number = 0xFF1101;
const RADIUS: number = 8;
const VERTEX_GEOMETRY: SphereGeometry  = new SphereGeometry(RADIUS, RADIUS, RADIUS);
const VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial ( {color : RED});

export class TrackVertices {

    private vertices: Array<Mesh>;
    private scene: THREE.Scene;

    public constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.vertices = new Array();
    }

    public addVertex(x: number, y: number): void {
        const vertex: Mesh = new Mesh(VERTEX_GEOMETRY, VERTEX_MATERIAL);
        vertex.position.set(x, y, 0);
        this.scene.add (vertex);
        this.vertices.push(vertex);
    }

    public removeLastVertex(): void {
        this.scene.remove(this.vertices.pop());
    }
}
