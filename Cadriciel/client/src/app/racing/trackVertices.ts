import { SphereGeometry, MeshBasicMaterial, Mesh, Scene, Line, Geometry,LineBasicMaterial, Vector3 } from "three";

const RED: number = 0xFF1101;
const RADIUS: number = 8;
const VERTEX_GEOMETRY: SphereGeometry  = new SphereGeometry(RADIUS, RADIUS, RADIUS);
const VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial ( {color : RED});

export class TrackVertices {

    private vertices: Array<Mesh>;
    private scene: Scene;
    private line: Line;

    public constructor(scene: Scene) {
        this.scene = scene;
        this.vertices = new Array();
    }

    public addVertex(x: number, y: number): void {
        const vertex: Mesh = new Mesh(VERTEX_GEOMETRY, VERTEX_MATERIAL);
        vertex.position.set(x, y, 0);
        this.scene.add (vertex);
        this.vertices.push(vertex);
        this.connectPoints();
    }

    public removeLastVertex(): void {
        this.scene.remove(this.vertices.pop());
    }

    public connectPoints () {
        for (let i = 0; i < this.vertices.length; i++){
            const LineMaterial = new LineBasicMaterial ({ color: 0x0110ff });
            const geometry = new Geometry();
            geometry.vertices.push(new Vector3(this.vertices[i].position.x,this.vertices[i].position.y , 0));
            geometry.vertices.push(new Vector3(this.vertices[i+1].position.x,this.vertices[i+1].position.y , 0));
            //geometry.vertices.push(new Vector3(10, 0, 0));
            //lines are drawn between each consecutive pair of vertices, but not between the first and last (the line is not closed)
            this.line = new Line(geometry, LineMaterial);
            this.scene.add(this.line);
        }
      }
}
