import {
    Vector3, Scene, AmbientLight, Mesh, Line, SphereGeometry,
    MeshBasicMaterial, LineBasicMaterial, Geometry, BackSide
} from "three";
import { PI_OVER_4, WHITE, RED, PINK, BLUE, PI_OVER_2 } from "./constants";
import { Angle } from "./angle";

const RADIUS: number = 12;
const OUTLINE_TO_VERTEX_RATIO: number = 1.25;
const VERTEX_GEOMETRY: SphereGeometry = new SphereGeometry(RADIUS, RADIUS, RADIUS);
const SIMPLE_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial({ color: WHITE });
const UNAUTHORIZED_LINE_MATERIAL: LineBasicMaterial = new LineBasicMaterial({ color: RED });
const START_VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial({ color: PINK });
const SIMPLE_VERTEX_MATERIAL: MeshBasicMaterial = new MeshBasicMaterial({ color: BLUE });
const TRACK_WIDTH: number = 150;
const AMBIENT_LIGHT_OPACITY: number = 0.5;

export class EditorScene {
    private scene: Scene;
    private vertices: Array<Mesh>;
    private connections: Array<Line>;

    private firstVertex: Mesh;
    private lastVertex: Mesh;
    private selectedVertex: Mesh;
    private nbVertices: number = 0;
    private isComplete: boolean = false;
    private angles: Array<Angle>;

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

    public completeTrack(): void {
        this.isComplete = true;
        this.addConnection(this.lastVertex, this.firstVertex);
    }

    public addConnection(firstVertex: Mesh, secondVertex: Mesh): void {
        const connection: Line = this.createConnection(firstVertex, secondVertex);
        this.connections.push(connection);
        this.scene.add(connection);
        this.checkConstraints();
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
        this.checkConstraints();
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
        this.checkConstraints();
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
    private checkConstraints(): void {
        for (const connection of this.connections) {
            connection.material = SIMPLE_LINE_MATERIAL;
        }
        this.checkLength();
        this.checkAngle();
        this.checkIntersection();
    }

    private checkLength(): void {
        for (const connection of this.connections) {
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
        this.angles = new Array<Angle>();
        if (this.connections.length > 0) {
            let limit: number;
            this.isComplete ?
                limit = this.connections.length :
                limit = this.connections.length - 1;
            for (let i: number = 0; i < limit; i++) {
                let indexPlusOne: number;
                i === this.connections.length - 1 ?
                    indexPlusOne = 0 :
                    indexPlusOne = i + 1;
                const current: Line = this.connections[i];
                const next: Line = this.connections[indexPlusOne];
                const angle: Angle = new Angle(current, next);
                this.angles.push(angle);
            }
            for (const angle of this.angles) {
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
            const geo: Geometry = (line1.geometry) as Geometry;
            const vector1: Vector3[] = geo.vertices;
            for (let j: number = 0; j < this.connections.length; j++) {
                if (j > i + 1) {
                    const line2: Line = this.connections[j];
                    // const intersectionCenter: boolean = this.checkIntersectionWithOffset(vector1, line2, 0);
                    const intersection: boolean = this.checkIntersectionWithOffset(vector1, line2, TRACK_WIDTH / 2);
                    // const intersectionRight: boolean = this.checkIntersectionWithOffset(vector1, line2, -TRACK_WIDTH / 2);
                    if (intersection) {
                        line1.material = UNAUTHORIZED_LINE_MATERIAL;
                        line2.material = UNAUTHORIZED_LINE_MATERIAL;
                    }
                }
            }
        }
    }

    // tslint:disable-next-line:max-func-body-length
    private checkIntersectionWithOffset(vector1: Vector3[], line2: Line, offset: number): boolean {
        let intersects: boolean;
        const geo: Geometry = (line2.geometry) as Geometry;
        const vector2: Vector3[] = geo.vertices;
        const vector3: Vector3[] = this.translateVector(vector1, offset);
        const vector4: Vector3[] = this.translateVector(vector2, offset);
        const vector5: Vector3[] = this.translateVector(vector1, -offset);
        const vector6: Vector3[] = this.translateVector(vector2, -offset);
        const vector7: Vector3[] = this.perpendicularVector(vector1, offset);
        const vector8: Vector3[] = this.perpendicularVector(vector2, offset);
        const vector9: Vector3[] = this.perpendicularVector(vector1, -offset);
        const vector10: Vector3[] = this.perpendicularVector(vector2, -offset);
        const vectors1: Array<Vector3[]> = [vector1, vector3, vector5, vector7, vector9];
        const vectors2: Array<Vector3[]> = [vector2, vector4, vector6, vector8, vector10];

        for (const vectorToCheck1 of vectors1) {
            for (const vectorToCheck2 of vectors2) {
                let det: number, gamma: number, lambda: number;
                det = (vectorToCheck1[1].x - vectorToCheck1[0].x) * (vectorToCheck2[1].y - vectorToCheck2[0].y)
                    - (vectorToCheck2[1].x - vectorToCheck2[0].x) * (vectorToCheck1[1].y - vectorToCheck1[0].y);
                if (det === 0) {
                    intersects = false;
                } else {
                    lambda = ((vectorToCheck2[1].y - vectorToCheck2[0].y) * (vectorToCheck2[1].x - vectorToCheck1[0].x)
                        + (vectorToCheck2[0].x - vectorToCheck2[1].x) * (vectorToCheck2[1].y - vectorToCheck1[0].y)) / det;
                    gamma = ((vectorToCheck1[0].y - vectorToCheck1[1].y) * (vectorToCheck2[1].x - vectorToCheck1[0].x)
                        + (vectorToCheck1[1].x - vectorToCheck1[0].x) * (vectorToCheck2[1].y - vectorToCheck1[0].y)) / det;
                    intersects = (lambda > 0 && lambda < 1) && (gamma > 0 && gamma < 1);
                }
                if (intersects) {
                    break;
                }
            }
            if (intersects) {
                break;
            }
        }

        return intersects;
    }

    private translateVector(vector: Vector3[], offset: number): Vector3[] {
        const normalVector: Vector3 = new Vector3(vector[1].x - vector[0].x, vector[1].y - vector[0].y, 0);
        const perpendicularVector: Vector3 = normalVector.applyAxisAngle(new Vector3(0, 0, 1), PI_OVER_2);
        perpendicularVector.normalize();
        const vector3: Vector3[] = new Array<Vector3>(vector.length);
        vector3[0] = new Vector3(vector[0].x + perpendicularVector.x * offset, vector[0].y + perpendicularVector.y * offset);
        vector3[1] = new Vector3(vector[1].x + perpendicularVector.x * offset, vector[1].y + perpendicularVector.y * offset);
        const LINE_GEOMETRY: Geometry = new Geometry();
        LINE_GEOMETRY.vertices.push(vector3[0]);
        LINE_GEOMETRY.vertices.push(vector3[1]);
        const connection: Line = (this.connections.length) ?
            new Line(LINE_GEOMETRY, SIMPLE_LINE_MATERIAL) :
            new Line(LINE_GEOMETRY, SIMPLE_LINE_MATERIAL);
        this.scene.add(connection);

        return vector3;
    }

    private perpendicularVector(vector: Vector3[], offset: number): Vector3[] {
        const normalVector: Vector3 = new Vector3(vector[1].x - vector[0].x, vector[1].y - vector[0].y, 0);
        const perpendicularVector: Vector3 = normalVector.applyAxisAngle(new Vector3(0, 0, 1), PI_OVER_2);
        perpendicularVector.normalize();
        const vector3: Vector3[] = new Array<Vector3>(vector.length);
        vector3[0] =
            new Vector3(vector[0].x, vector[0].y, 0);
        vector3[1] =
            new Vector3(vector[0].x + perpendicularVector.x * offset, vector[0].y + perpendicularVector.y * offset, 0);

        const LINE_GEOMETRY: Geometry = new Geometry();
        LINE_GEOMETRY.vertices.push(vector3[0]);
        LINE_GEOMETRY.vertices.push(vector3[1]);
        const connection: Line = (this.connections.length) ?
            new Line(LINE_GEOMETRY, SIMPLE_LINE_MATERIAL) :
            new Line(LINE_GEOMETRY, SIMPLE_LINE_MATERIAL);
        this.scene.add(connection);

        return vector3;
    }
}
