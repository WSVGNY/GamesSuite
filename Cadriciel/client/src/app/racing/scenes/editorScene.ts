import {
    Vector3, AmbientLight, Mesh, Line, SphereGeometry,
    MeshBasicMaterial, LineBasicMaterial, Geometry, BackSide, Scene
} from "three";
import { WHITE, PINK, BLUE } from "../constants";
import { CommonCoordinate3D } from "../../../../../common/racing/commonCoordinate3D";
import { ConstraintValidator } from "../editor/constraints/constraintValidator";

const RADIUS: number = 2.5;
const OUTLINE_TO_VERTEX_RATIO: number = 1.25;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
export const VERTEX_GEOMETRY: SphereGeometry = new SphereGeometry(RADIUS);
export const SIMPLE_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial({ color: WHITE });
export const START_VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial({ color: PINK });
export const SIMPLE_VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial({ color: BLUE });

export class EditorScene extends Scene {
    private _vertices: Mesh[];
    private _connections: Line[];
    private _firstVertex: Mesh;
    private _lastVertex: Mesh;
    private _selectedVertex: Mesh;
    private _isComplete: boolean = false;

    public constructor() {
        super();
        this.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this._vertices = [];
        this._connections = [];
    }

    public importTrackVertices(trackVertices: CommonCoordinate3D[]): void {
        this.clear();
        for (const entry of trackVertices) {
            this.addVertex(new Vector3(entry.z, entry.x, 0));
        }
        if (trackVertices.length !== 0) {
            this.completeTrack();
        }
    }

    private clear(): void {
        for (const entry of this._vertices) {
            this.remove(entry);
        }
        for (const entry of this._connections) {
            this.remove(entry);
        }
        this._vertices = [];
        this._connections = [];
    }

    public exportTrackVertices(): CommonCoordinate3D[] {
        const trackVertices: CommonCoordinate3D[] = [];
        for (const entry of this._vertices) {
            trackVertices.push(new CommonCoordinate3D(entry.position.y, entry.position.z, entry.position.x));
        }

        return trackVertices;
    }

    public setSelectedVertex(vertexName: string): void {
        for (const entry of this._vertices) {
            if (entry.name === vertexName) {
                this._selectedVertex = entry;
            }
        }
    }

    public deselectVertex(): void {
        this._selectedVertex = undefined;
    }

    public get isEmpty(): boolean {
        return this._vertices.length === 0;
    }

    public get firstVertex(): Mesh {
        return this._firstVertex;
    }

    public get selectedVertex(): Mesh {
        return this._selectedVertex;
    }

    public get vertices(): Mesh[] {
        return this._vertices;
    }

    public get connections(): Line[] {
        return this._connections;
    }

    public get isComplete(): boolean {
        return this._isComplete;
    }

    private createVertex(position: Vector3): Mesh {
        const vertex: Mesh = (this._vertices.length === 0) ?
            new Mesh(VERTEX_GEOMETRY, START_VERTEX_MATERIAL) :
            new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex.position.set(position.x, position.y, 0);
        vertex.name = (this._vertices.length) ? "vertex" + this._vertices.length : "Start";

        const outlineMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: WHITE, side: BackSide });
        const outlineMesh: Mesh = new Mesh(VERTEX_GEOMETRY, outlineMaterial);
        outlineMesh.scale.multiplyScalar(OUTLINE_TO_VERTEX_RATIO);
        vertex.add(outlineMesh);

        return vertex;
    }

    public addVertex(position: Vector3): void {
        const vertex: Mesh = this.createVertex(position);
        this.add(vertex);
        this._vertices.push(vertex);
        if (this._vertices.length <= 1) {
            this._firstVertex = vertex;
        } else {
            this.addConnection(this._lastVertex, vertex);
        }
        this._lastVertex = vertex;
    }

    public removeLastVertex(): void {
        this.remove(this._vertices.pop());
        this.remove(this._connections.pop());
        this._lastVertex = (this._vertices.length === 0) ? undefined : this._vertices[this._vertices.length - 1];
        if (this._isComplete) {
            this._isComplete = false;
            this.remove(this._connections.pop());
        }
    }

    private createConnection(start: Mesh, end: Mesh): Line {
        const LINE_GEOMETRY: Geometry = new Geometry();
        LINE_GEOMETRY.vertices.push(new Vector3(start.position.x, start.position.y, 0));
        LINE_GEOMETRY.vertices.push(new Vector3(end.position.x, end.position.y, 0));
        const connection: Line = (this._connections.length) ?
            new Line(LINE_GEOMETRY, SIMPLE_LINE_MATERIAL) :
            new Line(LINE_GEOMETRY, SIMPLE_LINE_MATERIAL);
        connection.name = "connection" + (this._connections.length);

        return connection;
    }

    public addConnection(firstVertex: Mesh, secondVertex: Mesh): void {
        const connection: Line = this.createConnection(firstVertex, secondVertex);
        this._connections.push(connection);
        this.add(connection);
    }

    public completeTrack(): void {
        this._isComplete = true;
        this.addConnection(this._lastVertex, this._firstVertex);
    }

    public moveSelectedVertex(newPosition: Vector3): void {
        this.setVertexPosition(this._selectedVertex, newPosition);
        this.updatePreviousConnection(this._selectedVertex);
        this.updateFollowingConnection(this._selectedVertex);
    }

    public setVertexPosition(vertex: Mesh, newPosition: Vector3): void {
        vertex.position.x = newPosition.x;
        vertex.position.y = newPosition.y;
    }

    public updateConnection(vertex1: Mesh, vertex2: Mesh): void {
        const LINE_GEOMETRY: Geometry = new Geometry();
        LINE_GEOMETRY.vertices.push(new Vector3(vertex1.position.x, vertex1.position.y, 0));
        LINE_GEOMETRY.vertices.push(new Vector3(vertex2.position.x, vertex2.position.y, 0));
        this.remove(this._connections[this._vertices.indexOf(vertex1)]);
        this._connections[this._vertices.indexOf(vertex1)] = new Line(LINE_GEOMETRY, SIMPLE_LINE_MATERIAL);
        this.add(this._connections[this._vertices.indexOf(vertex1)]);
    }

    public updateFollowingConnection(entry: Mesh): void {
        if (this._isComplete && this._vertices.indexOf(entry) + 1 === this._vertices.length) {
            this.updateConnection(entry, this._firstVertex);
        } else if (this._vertices.indexOf(entry) + 1 !== this._vertices.length) {
            const nextVertex: Mesh = this._vertices[this._vertices.indexOf(entry) + 1];
            this.updateConnection(entry, nextVertex);
        }
    }

    public updatePreviousConnection(entry: Mesh): void {
        if (this._isComplete && entry === this._firstVertex) {
            this.updateConnection(this._lastVertex, entry);
        } else if (this._vertices.indexOf(entry) - 1 >= 0) {
            const previousVertex: Mesh = this._vertices[this._vertices.indexOf(entry) - 1];
            this.updateConnection(previousVertex, entry);
        }
    }

    public checkConstraints(): boolean {
        for (const connection of this._connections) {
            connection.material = SIMPLE_LINE_MATERIAL;
        }

        const lengthOk: boolean = ConstraintValidator.checkLength(this._connections);
        const angleOk: boolean = ConstraintValidator.checkAngle(this._connections, this._isComplete);
        const intersectionOk: boolean = ConstraintValidator.checkIntersection(this._connections, this._isComplete);

        return lengthOk && angleOk && intersectionOk && this._isComplete;
    }
}
