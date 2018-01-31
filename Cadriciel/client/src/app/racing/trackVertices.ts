import { SphereGeometry, MeshBasicMaterial, Mesh, Scene, Line, Geometry, LineBasicMaterial, Vector3, Vector2 } from "three";

const RED: number = 0xFF1101;
const BLUE: number = 0x0110FF;
const RADIUS: number = 8;
const VERTEX_GEOMETRY: SphereGeometry  = new SphereGeometry(RADIUS, RADIUS, RADIUS);
const VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial ({color : RED});
const LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial ({ color: BLUE });

export class TrackVertices {

    private vertices: Array<Mesh>;
    private scene: Scene;
    private line: Line;
    private lines : Array<Line>;
    private numberOfVertices : number;

    public constructor(scene: Scene) {
        this.scene = scene;
        this.vertices = new Array();
        this.lines = new Array();
        this.numberOfVertices = 0;
    }

    public addVertex(position: Vector2): void {
        const vertex: Mesh = new Mesh(VERTEX_GEOMETRY, VERTEX_MATERIAL);
        vertex.position.set(position.x, position.y, 0);
        this.scene.add (vertex);
        this.vertices.push(vertex);
        if (this.numberOfVertices > 0 ){
            this.connectPoints(this.vertices[this.numberOfVertices-1], this.vertices[this.numberOfVertices]);
        }
        this.numberOfVertices = this.numberOfVertices + 1;
    }

    public removeLastVertex(): void {
        this.scene.remove(this.vertices.pop());
        this.scene.remove (this.lines.pop());

    }

    public connectPoints (v1 : Mesh , v2 : Mesh): void {
            const LINE_GEOMETRY: Geometry = new Geometry();
            LINE_GEOMETRY.vertices.push(new Vector3(v1.position.x, v1.position.y , 0));
            LINE_GEOMETRY.vertices.push(new Vector3(v2.position.x, v2.position.y , 0));
            this.line = new Line(LINE_GEOMETRY, LINE_MATERIAL);
            this.lines.push(this.line);
            this.scene.add(this.line);
        }
    
    }
}
