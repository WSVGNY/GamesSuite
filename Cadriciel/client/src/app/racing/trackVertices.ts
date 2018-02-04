import { SphereGeometry, MeshBasicMaterial, Mesh, Scene, Line, Geometry, LineBasicMaterial, Vector3} from "three";

const ORANGE: number = 0xFF6600;
const GREEN: number = 0x26FF00;
const WHITE: number = 0xFFFFFF;
const PINK: number = 0xFF00BF;
const RADIUS: number = 12;
const VERTEX_GEOMETRY: SphereGeometry  = new SphereGeometry(RADIUS, RADIUS, RADIUS);
const START_VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial ({color : PINK});
const SIMPLE_VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial ({color : ORANGE});
const START_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial ({ color: GREEN });
const LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial ({ color: WHITE });

export class TrackVertices {

    private vertices: Array<Mesh>;
    private connections: Array<Line>;
    private scene: Scene;
    private nbVertices: number;
    private firstVertex: Mesh;
    private lastVertex: Mesh;
    private isComplete: boolean = false;

    public constructor(scene: Scene) {
        this.scene = scene;
        this.vertices = new Array();
        this.connections = new Array();
        this.nbVertices = 0;
    }

    public addVertex(position: Vector3): void {
        const vertex: Mesh = (this.nbVertices === 0 ) ?
            new Mesh(VERTEX_GEOMETRY, START_VERTEX_MATERIAL) :
            new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex.position.set(position.x, position.y, 0);
        vertex.name = (this.nbVertices) ? "vertex" + this.nbVertices : "Start";
        this.scene.add (vertex);
        this.vertices.push(vertex);
        if (this.nbVertices === 0 ) {
            this.firstVertex = vertex;
        } else {
            this.createConnection(this.lastVertex, vertex);
        }
        this.nbVertices++;
        this.lastVertex = vertex;
    }

    public removeLastVertex(): void {
        this.scene.remove(this.vertices.pop());
        this.scene.remove (this.connections.pop());
        this.nbVertices--;
        this.lastVertex = this.vertices[this.nbVertices - 1];
        if (this.isComplete) {
            this.isComplete = false;
            this.scene.remove (this.connections.pop());
        }
    }

    public createConnection(start: Mesh , end: Mesh): void {
        const LINE_GEOMETRY: Geometry = new Geometry();
        LINE_GEOMETRY.vertices.push(new Vector3(start.position.x, start.position.y , 0));
        LINE_GEOMETRY.vertices.push(new Vector3(end.position.x, end.position.y , 0));
        const connection: Line = (this.connections.length) ?
            new Line(LINE_GEOMETRY, LINE_MATERIAL) :
            new Line(LINE_GEOMETRY, START_LINE_MATERIAL);
        connection.name = "connection" + this.nbVertices;
        this.connections.push(connection);
        this.scene.add(connection);
    }

    public completeLoop(): void {
        this.createConnection(this.lastVertex, this.firstVertex);
        this.isComplete = true;
    }

    public updateConnection(vertex1: Mesh, vertex2: Mesh ): void {
        const LINE_GEOMETRY: Geometry = new Geometry();
        LINE_GEOMETRY.vertices.push(new Vector3(vertex1.position.x, vertex1.position.y , 0));
        LINE_GEOMETRY.vertices.push(new Vector3(vertex2.position.x, vertex2.position.y , 0));
        this.scene.remove(this.connections[this.vertices.indexOf(vertex1)]);
        this.connections[this.vertices.indexOf(vertex1)] = new Line(LINE_GEOMETRY, LINE_MATERIAL);
        this.scene.add(this.connections[this.vertices.indexOf(vertex1)]);
    }

    public setVertexPosition( vertexName: String, position: Vector3 ): void {
        // tslint:disable-next-line:prefer-const
        for (let entry of this.vertices) {
            if (entry.name === vertexName) {
                entry.position.x = position.x;
                entry.position.y = position.y;
                if (this.isComplete && this.vertices.indexOf(entry) + 1 === this.nbVertices) {
                    this.updateConnection(entry, this.firstVertex);
                } else if (this.vertices.indexOf(entry) + 1 !== this.nbVertices) {
                    const nextVertex: Mesh = this.vertices[this.vertices.indexOf(entry) + 1];
                    this.updateConnection(entry, nextVertex);

                }
                if (this.isComplete && entry === this.firstVertex) {
                    this.updateConnection(this.lastVertex, entry);
                } else {
                    const previousVertex: Mesh = this.vertices[this.vertices.indexOf(entry) - 1];
                    this.updateConnection(previousVertex, entry);
                }
            }
        }
    }

    public getFirstVertex(): Mesh {
        return this.firstVertex;
    }

    public getLastVertex(): Mesh {
        return this.lastVertex;
    }

    public getVertices(): Array<Mesh> {
        return this.vertices;
    }

    public isEmpty(): boolean {
        return (this.nbVertices === 0) ? true : false;
    }

    public $isComplete(): boolean {
        return this.isComplete;
    }
}
