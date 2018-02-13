import { SphereGeometry, MeshBasicMaterial, Mesh, Scene, Line, Geometry, LineBasicMaterial, Vector3} from "three";

const ORANGE: number = 0xFF6600;
const GREEN: number = 0x26FF00;
const WHITE: number = 0xFFFFFF;
const PINK: number = 0xFF00BF;
const RADIUS: number = 12;
export const VERTEX_GEOMETRY: SphereGeometry  = new SphereGeometry(RADIUS, RADIUS, RADIUS);
const START_VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial ({color : PINK});
export const SIMPLE_VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial ({color : ORANGE});
const START_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial ({ color: GREEN });
export const LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial ({ color: WHITE });

export class TrackVertices {

    private _vertices: Array<Mesh>;
    private _connections: Array<Line>;
    private _scene: Scene;
    private _nbVertices: number;
    private _firstVertex: Mesh;
    private _lastVertex: Mesh;
    private _isComplete: boolean = false;

    public constructor(scene: Scene) {
        this._scene = scene;
        this._vertices = new Array();
        this._connections = new Array();
        this._nbVertices = 0;
    }

    public addVertex(position: Vector3): void {
        const vertex: Mesh = this.createVertex(position);
        this._scene.add (vertex);
        this._vertices.push(vertex);
        if (this._vertices.length <= 1) {
            this._firstVertex = vertex;
        } else {
            this.addConnection(this._lastVertex, vertex);
        }
        this._nbVertices++;
        this._lastVertex = vertex;
    }

    private createVertex(position: Vector3): Mesh {
        const vertex: Mesh = (this._nbVertices === 0 ) ?
            new Mesh(VERTEX_GEOMETRY, START_VERTEX_MATERIAL) :
            new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex.position.set(position.x, position.y, 0);
        vertex.name = (this._nbVertices) ? "vertex" + this._nbVertices : "Start";

        return vertex;
    }

    public addConnection(firstVertex: Mesh , secondVertex: Mesh): void {
        const connection: Line = this.createConnection(firstVertex, secondVertex);
        this._connections.push(connection);
        this._scene.add(connection);
    }

    private createConnection(start: Mesh , end: Mesh): Line {
        const LINE_GEOMETRY: Geometry = new Geometry();
        LINE_GEOMETRY.vertices.push(new Vector3(start.position.x, start.position.y , 0));
        LINE_GEOMETRY.vertices.push(new Vector3(end.position.x, end.position.y , 0));
        const connection: Line = (this._connections.length) ?
            new Line(LINE_GEOMETRY, LINE_MATERIAL) :
            new Line(LINE_GEOMETRY, START_LINE_MATERIAL);
        connection.name = "connection" + (this._connections.length);

        return connection;
    }

    public removeLastVertex(): void {
        this._scene.remove(this._vertices.pop());
        this._scene.remove (this._connections.pop());
        this._nbVertices--;
        this._lastVertex = this._vertices[this._nbVertices - 1];
        if (this._isComplete) {
            this._isComplete = false;
            this._scene.remove (this._connections.pop());
        }
    }

    public completeLoop(): void {
        this.addConnection(this._lastVertex, this._firstVertex);
        this._isComplete = true;
    }

    public updateConnection(vertex1: Mesh, vertex2: Mesh ): void {
        const LINE_GEOMETRY: Geometry = new Geometry();
        LINE_GEOMETRY.vertices.push(new Vector3(vertex1.position.x, vertex1.position.y , 0));
        LINE_GEOMETRY.vertices.push(new Vector3(vertex2.position.x, vertex2.position.y , 0));
        this._scene.remove(this._connections[this._vertices.indexOf(vertex1)]);
        this._connections[this._vertices.indexOf(vertex1)] = new Line(LINE_GEOMETRY, LINE_MATERIAL);
        this._scene.add(this._connections[this._vertices.indexOf(vertex1)]);
    }

    public updateFollowingConnection( entry: Mesh ): void {
        if (this._isComplete && this._vertices.indexOf(entry) + 1 === this._vertices.length) {
            this.updateConnection(entry, this._firstVertex);
        } else if (this._vertices.indexOf(entry) + 1 !== this._vertices.length) {
            const nextVertex: Mesh = this._vertices[this._vertices.indexOf(entry) + 1];
            this.updateConnection(entry, nextVertex);
        }
    }

    public updatePreviousConnection( entry: Mesh ): void {
        if (this._isComplete && entry === this._firstVertex) {
            this.updateConnection(this._lastVertex, entry);
        } else {
            const previousVertex: Mesh = this._vertices[this._vertices.indexOf(entry) - 1];
            this.updateConnection(previousVertex, entry);
        }
    }

    public moveVertex(vertexName: String, newPosition: Vector3): void {
        for (const entry of this._vertices) {
            if (entry.name === vertexName) {
                this.setVertexPosition(entry, newPosition);
                this.updatePreviousConnection(entry);
                this.updateFollowingConnection(entry);
            }
        }
    }

    public setVertexPosition( vertex: Mesh, newPosition: Vector3 ): void {
        vertex.position.x = newPosition.x;
        vertex.position.y = newPosition.y;
    }

    public getFirstVertex(): Mesh {
        return this._firstVertex;
    }

    public getLastVertex(): Mesh {
        return this._lastVertex;
    }

    public getVertices(): Array<Mesh> {
        return this._vertices;
    }

    public isEmpty(): boolean {
        return (this._vertices.length === 0) ? true : false;
    }

    public isComplete(): boolean {
        return this._isComplete;
    }

    public getScene(): Scene {
        return this._scene;
    }
}
