import {
    Vector3, Scene, AmbientLight, Mesh, Line, SphereGeometry,
    MeshBasicMaterial, LineBasicMaterial, Geometry, BackSide
} from "three";
import { PI_OVER_4, WHITE, RED, PINK, BLUE, HALF } from "../constants";
import { Angle } from "./constraints/angle";
import { Intersection } from "./constraints/intersection";
import { Coordinate } from "../../../../../common/crossword/coordinate";

const RADIUS: number = 12;
const OUTLINE_TO_VERTEX_RATIO: number = 1.25;
const VERTEX_GEOMETRY: SphereGeometry = new SphereGeometry(RADIUS, RADIUS, RADIUS);
const SIMPLE_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial({ color: WHITE });
const UNAUTHORIZED_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial({ color: RED });
const START_VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial({ color: PINK });
const SIMPLE_VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial({ color: BLUE });
const TRACK_WIDTH: number = 100;
const AMBIENT_LIGHT_OPACITY: number = 0.5;

export class EditorScene {
    private _scene: Scene;
    private _vertices: Array<Mesh>;
    private _connections: Array<Line>;
    private _angles: Array<Angle>;

    private _firstVertex: Mesh;
    private _lastVertex: Mesh;
    private _selectedVertex: Mesh;
    private _nbVertices: number = 0;
    private _isComplete: boolean = false;

    public constructor() {
        this._scene = new Scene();
        this._scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this._vertices = new Array();
        this._connections = new Array();
    }

    public importTrackVertices(trackVertices: Array<Coordinate>): void {
        this.clear();
        for (const entry of trackVertices) {
            this.addVertex(new Vector3(entry._x, entry._y, 0));
        }
        // this.completeTrack();
    }

    private clear(): void {
        for (const entry of this._vertices) {
            this._scene.remove(entry);
        }
        for (const entry of this._connections) {
            this._scene.remove(entry);
        }
        this._vertices = [];
        this._connections = [];
    }

    public exportTrackVertices(): Array<Coordinate> {
        const trackVertices: Array<Coordinate> = new Array();
        for (const entry of this.vertices) {
            trackVertices.push(new Coordinate(entry.position.x, entry.position.y));
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

    public get scene(): Scene {
        return this._scene;
    }

    public get isEmpty(): boolean {
        return (this._vertices.length === 0) ? true : false;
    }

    public get firstVertex(): Mesh {
        return this._firstVertex;
    }

    public get selectedVertex(): Mesh {
        return this._selectedVertex;
    }

    public get vertices(): Array<Mesh> {
        return this._vertices;
    }

    public get connections(): Array<Line> {
        return this._connections;
    }

    public get nbVertices(): number {
        return this._nbVertices;
    }

    public get isComplete(): boolean {
        return this._isComplete;
    }

    private createVertex(position: Vector3): Mesh {
        const vertex: Mesh = (this._nbVertices === 0) ?
            new Mesh(VERTEX_GEOMETRY, START_VERTEX_MATERIAL) :
            new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex.position.set(position.x, position.y, 0);
        vertex.name = (this._nbVertices) ? "vertex" + this._nbVertices : "Start";

        const outlineMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: WHITE, side: BackSide });
        const outlineMesh: Mesh = new Mesh(VERTEX_GEOMETRY, outlineMaterial);
        outlineMesh.scale.multiplyScalar(OUTLINE_TO_VERTEX_RATIO);
        vertex.add(outlineMesh);

        return vertex;
    }

    public addVertex(position: Vector3): void {
        const vertex: Mesh = this.createVertex(position);
        this._scene.add(vertex);
        this._vertices.push(vertex);
        if (this._vertices.length <= 1) {
            this._firstVertex = vertex;
        } else {
            this.addConnection(this._lastVertex, vertex);
        }
        this._nbVertices++;
        this._lastVertex = vertex;
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

    public completeTrack(): void {
        this._isComplete = true;
        this.addConnection(this._lastVertex, this._firstVertex);
    }

    public addConnection(firstVertex: Mesh, secondVertex: Mesh): void {
        const connection: Line = this.createConnection(firstVertex, secondVertex);
        this._connections.push(connection);
        this._scene.add(connection);
        this.checkConstraints();
    }

    public removeLastVertex(): void {
        this._scene.remove(this._vertices.pop());
        this._scene.remove(this._connections.pop());
        this._nbVertices--;
        this._lastVertex = this._vertices[this._nbVertices - 1];
        if (this._isComplete) {
            this._isComplete = false;
            this._scene.remove(this._connections.pop());
        }
        this.checkConstraints();
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
        this._scene.remove(this._connections[this._vertices.indexOf(vertex1)]);
        this._connections[this._vertices.indexOf(vertex1)] = new Line(LINE_GEOMETRY, SIMPLE_LINE_MATERIAL);
        this._scene.add(this._connections[this._vertices.indexOf(vertex1)]);
        this.checkConstraints();
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
    private checkConstraints(): void {
        for (const connection of this._connections) {
            connection.material = SIMPLE_LINE_MATERIAL;
        }
        this.checkLength();
        this.checkAngle();
        this.checkIntersection();
    }

    private checkLength(): void {
        for (const connection of this._connections) {
            const geometry: Geometry = (connection.geometry) as Geometry;
            const vector1: Vector3[] = geometry.vertices;
            const length: number = Math.sqrt((vector1[1].x - vector1[0].x) * (vector1[1].x - vector1[0].x)
                + (vector1[1].y - vector1[0].y) * (vector1[1].y - vector1[0].y));
            if (length < TRACK_WIDTH) {
                connection.material = UNAUTHORIZED_LINE_MATERIAL;
            }
        }
    }

    // https://stackoverflow.com/questions/17763392/how-to-calculate-in-javascript-angle-between-3-points
    private checkAngle(): void {
        this._angles = new Array<Angle>();
        if (this.connections.length > 0) {
            let limit: number;
            this._isComplete ?
                limit = this._connections.length :
                limit = this._connections.length - 1;
            for (let i: number = 0; i < limit; i++) {
                let indexPlusOne: number;
                i === this._connections.length - 1 ?
                    indexPlusOne = 0 :
                    indexPlusOne = i + 1;
                const current: Line = this._connections[i];
                const next: Line = this._connections[indexPlusOne];
                const angle: Angle = new Angle(current, next);
                this._angles.push(angle);
            }
            for (const angle of this._angles) {
                if (angle.value < PI_OVER_4) {
                    angle.line1.material = UNAUTHORIZED_LINE_MATERIAL;
                    angle.line2.material = UNAUTHORIZED_LINE_MATERIAL;
                }
            }
        }
    }

    // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    private checkIntersection(): void {
        for (let i: number = 0; i < this.connections.length; i++) {
            const line1: Line = this.connections[i];
            const limit: number = this.isComplete && i === 0 ? this.connections.length - 1 : this.connections.length;
            for (let j: number = 0; j < limit; j++) {
                if (j > i + 1) {
                    const line2: Line = this.connections[j];
                    const intersection: Intersection = new Intersection(line1, line2, TRACK_WIDTH * HALF);
                    if (intersection.isIntersecting) {
                        line1.material = UNAUTHORIZED_LINE_MATERIAL;
                        line2.material = UNAUTHORIZED_LINE_MATERIAL;
                    }
                }
            }
        }
    }

}
