import {
    Vector3, Scene, AmbientLight, Mesh, Line, SphereGeometry,
    MeshBasicMaterial, LineBasicMaterial, Geometry, BackSide
} from "three";
import { PI_OVER_4 } from "./constants";

const WHITE: number = 0xFFFFFF;
const PINK: number = 0xFF00BF;
const BLUE: number = 0x0066FF;
const RED: number = 0xFF0000;
const RADIUS: number = 12;
const OUTLINE_TO_VERTEX_RATIO: number = 1.25;

const VERTEX_GEOMETRY: SphereGeometry = new SphereGeometry(RADIUS, RADIUS, RADIUS);
const SIMPLE_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial({ color: WHITE });
const UNAUTHORIZED_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial({ color: RED });
const START_VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial({ color: PINK });
const SIMPLE_VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial({ color: BLUE });

const AMBIENT_LIGHT_OPACITY: number = 0.5;

export class EditorScene {

    private scene: Scene;
    // private editedTrack: TrackVertices;
    private vertices: Array<Mesh>;
    private connections: Array<Line>;

    private firstVertex: Mesh;
    private lastVertex: Mesh;
    private selectedVertex: Mesh;
    private nbVertices: number = 0;
    private isComplete: boolean = false;

    public constructor() {
        this.scene = new Scene();
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this.vertices = new Array();
        this.connections = new Array();
    }

    public setSelectedVertex(vertexName: string): void {
        for (const entry of this.vertices) {
            if (entry.name === vertexName) {
                this.selectedVertex = entry;
            }
        }
    }

    public deselectVertex(): void {
        this.selectedVertex = undefined;
    }

    public get $scene(): Scene {
        return this.scene;
    }

    public get $isEmpty(): boolean {
        return (this.vertices.length === 0) ? true : false;
    }

    public get $firstVertex(): Mesh {
        return this.firstVertex;
    }

    public get $lastVertex(): Mesh {
        return this.lastVertex;
    }

    public get $selectedVertex(): Mesh {
        return this.selectedVertex;
    }

    public get $vertices(): Array<Mesh> {
        return this.vertices;
    }

    public get $connections(): Array<Line> {
        return this.connections;
    }

    public get $nbVertices(): number {
        return this.nbVertices;
    }

    public get $isComplete(): boolean {
        return this.isComplete;
    }

    private createVertex(position: Vector3): Mesh {
        const vertex: Mesh = (this.nbVertices === 0) ?
            new Mesh(VERTEX_GEOMETRY, START_VERTEX_MATERIAL) :
            new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex.position.set(position.x, position.y, 0);
        vertex.name = (this.nbVertices) ? "vertex" + this.nbVertices : "Start";

        const outlineMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: WHITE, side: BackSide });
        const outlineMesh: Mesh = new Mesh(VERTEX_GEOMETRY, outlineMaterial);
        outlineMesh.scale.multiplyScalar(OUTLINE_TO_VERTEX_RATIO);
        vertex.add(outlineMesh);

        return vertex;
    }

    public addVertex(position: Vector3): void {
        const vertex: Mesh = this.createVertex(position);
        this.scene.add(vertex);
        this.vertices.push(vertex);
        if (this.vertices.length <= 1) {
            this.firstVertex = vertex;
        } else {
            this.addConnection(this.lastVertex, vertex);
        }
        this.nbVertices++;
        this.lastVertex = vertex;
    }

    public completeTrack(): void {
        this.addConnection(this.lastVertex, this.firstVertex);
        this.isComplete = true;
    }

    private createConnection(start: Mesh, end: Mesh): Line {
        const LINE_GEOMETRY: Geometry = new Geometry();
        LINE_GEOMETRY.vertices.push(new Vector3(start.position.x, start.position.y, 0));
        LINE_GEOMETRY.vertices.push(new Vector3(end.position.x, end.position.y, 0));
        const connection: Line = (this.connections.length) ?
            new Line(LINE_GEOMETRY, SIMPLE_LINE_MATERIAL) :
            new Line(LINE_GEOMETRY, SIMPLE_LINE_MATERIAL);
        connection.name = "connection" + (this.connections.length);

        return connection;
    }

    private checkAngle(): void {
        if (this.connections.length > 0) {
            for (let i: number = 0; i < this.connections.length - 1; i++) {
                let indexPlusOne: number;
                i === this.connections.length - 1 ?
                    indexPlusOne = 0 :
                    indexPlusOne = i + 1;
                const current: Line = this.connections[i];
                let geo: Geometry = (current.geometry) as Geometry;
                const currentVec: Vector3[] = geo.vertices;
                const next: Line = this.connections[indexPlusOne];
                geo = (next.geometry) as Geometry;
                const nextVec: Vector3[] = geo.vertices;
                const vertex1: number = Math.sqrt((nextVec[0].x - currentVec[0].x) * (nextVec[0].x - currentVec[0].x)
                    + (nextVec[0].y - currentVec[0].y) * (nextVec[0].y - currentVec[0].y));
                const vertex2: number = Math.sqrt((nextVec[0].x - nextVec[1].x) * (nextVec[0].x - nextVec[1].x)
                    + (nextVec[0].y - nextVec[1].y) * (nextVec[0].y - nextVec[1].y));
                const vertex3: number = Math.sqrt((nextVec[1].x - currentVec[0].x) * (nextVec[1].x - currentVec[0].x)
                    + (nextVec[1].y - currentVec[0].y) * (nextVec[1].y - currentVec[0].y));
                const angle: number = Math.acos((vertex2 * vertex2 + vertex1 * vertex1 - vertex3 * vertex3)
                    / ((vertex2 * vertex1) + (vertex2 * vertex1)));
                console.log(i + ") " + angle);
                if (angle > PI_OVER_4) {
                    this.connections[indexPlusOne].material = SIMPLE_LINE_MATERIAL;
                } else {
                    this.connections[i].material = UNAUTHORIZED_LINE_MATERIAL;
                    this.connections[indexPlusOne].material = UNAUTHORIZED_LINE_MATERIAL;
                }
            }
        }
    }

    public addConnection(firstVertex: Mesh, secondVertex: Mesh): void {
        const connection: Line = this.createConnection(firstVertex, secondVertex);
        this.connections.push(connection);
        this.scene.add(connection);
        this.checkAngle();
    }

    public removeLastVertex(): void {
        this.scene.remove(this.vertices.pop());
        this.scene.remove(this.connections.pop());
        this.nbVertices--;
        this.lastVertex = this.vertices[this.nbVertices - 1];
        if (this.isComplete) {
            this.isComplete = false;
            this.scene.remove(this.connections.pop());
        }
    }

    public moveSelectedVertex(newPosition: Vector3): void {
        this.setVertexPosition(this.selectedVertex, newPosition);
        this.updatePreviousConnection(this.selectedVertex);
        this.updateFollowingConnection(this.selectedVertex);
    }

    public setVertexPosition(vertex: Mesh, newPosition: Vector3): void {
        vertex.position.x = newPosition.x;
        vertex.position.y = newPosition.y;
    }

    public updateConnection(vertex1: Mesh, vertex2: Mesh): void {
        const LINE_GEOMETRY: Geometry = new Geometry();
        LINE_GEOMETRY.vertices.push(new Vector3(vertex1.position.x, vertex1.position.y, 0));
        LINE_GEOMETRY.vertices.push(new Vector3(vertex2.position.x, vertex2.position.y, 0));
        this.scene.remove(this.connections[this.vertices.indexOf(vertex1)]);
        this.connections[this.vertices.indexOf(vertex1)] = new Line(LINE_GEOMETRY, SIMPLE_LINE_MATERIAL);
        this.scene.add(this.connections[this.vertices.indexOf(vertex1)]);
        this.checkAngle();
    }

    public updateFollowingConnection(entry: Mesh): void {
        if (this.isComplete && this.vertices.indexOf(entry) + 1 === this.vertices.length) {
            this.updateConnection(entry, this.firstVertex);
        } else if (this.vertices.indexOf(entry) + 1 !== this.vertices.length) {
            const nextVertex: Mesh = this.vertices[this.vertices.indexOf(entry) + 1];
            this.updateConnection(entry, nextVertex);
        }
    }

    public updatePreviousConnection(entry: Mesh): void {
        if (this.isComplete && entry === this.firstVertex) {
            this.updateConnection(this.lastVertex, entry);
        } else if (this.vertices.indexOf(entry) - 1 >= 0) {
            const previousVertex: Mesh = this.vertices[this.vertices.indexOf(entry) - 1];
            this.updateConnection(previousVertex, entry);
        }
    }
}
