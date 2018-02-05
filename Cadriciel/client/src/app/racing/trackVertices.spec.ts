import { TrackVertices, VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL, LINE_MATERIAL } from "./trackVertices";
import { Scene, Vector3, Mesh, Geometry, Line, Object3D } from "three";

describe("TrackVertices", () => {
    let scene: Scene;
    let trackVertices: TrackVertices;

    beforeEach(() => {
        scene = new Scene();
        trackVertices = new TrackVertices(scene);
    });

    it("should cerate a point in the scene", ()  => {
        trackVertices.addVertex(new Vector3( 0, 0, 0 ));
        const vertex: Object3D = scene.getObjectByName("Start");
        expect(vertex).toBeDefined();
    });

    it("should create a connection between two points", ()  => {
        const vertex0: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        const vertex1: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex0.position.set(0, 0, 0 );
        vertex1.position.set(0, 0, 0 );
        trackVertices.addConnection(vertex0, vertex1);
        expect(scene.getChildByName("connection0")).toBeDefined();
    });

    it("first vertex of new connection should be the point before it", ()  => {
        const vertex0: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        const vertex1: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex0.position.set(0, 0, 0 );
        vertex1.position.set(1, 1, 0 );
        trackVertices.addConnection(vertex0, vertex1);
        const connection: Line = scene.getChildByName("connection0") as Line;
        const geometry: Geometry = connection["geometry"] as Geometry;
        const vertices: Array<Vector3> = geometry["vertices"];
        expect(vertices.length === 0).toBeTruthy();
    });

    it("should remove the last point added to the scene", ()  => {
        const vertex: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex.position.set(0, 0, 0 );
        trackVertices["vertices"].push(vertex);
        scene.add(vertex);
        trackVertices.removeLastVertex();
        expect(scene.children.length).toBeFalsy();
    });

    it("should remove the last connection added to the scene", ()  => {
        const LINE_GEOMETRY: Geometry = new Geometry();
        LINE_GEOMETRY.vertices.push(new Vector3(0, 0, 0));
        LINE_GEOMETRY.vertices.push(new Vector3(1, 1, 0));
        const connection: Line = new Line(LINE_GEOMETRY, LINE_MATERIAL);
        trackVertices["connections"].push(connection);
        scene.add(connection);
        trackVertices.removeLastVertex();
        expect(scene.children.length).toBeFalsy();
    });
/*
    it("should update the position of a dragged point", ()  => {
        const vertex: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex.position.set(0, 0, 0 );
        vertex.name = "vertex0";
        trackVertices["vertices"].push(vertex);
        scene.add(vertex);
        trackVertices.moveVertex("vertex0", new Vector3(2, 2, 0));
        expect(scene.).toBeFalsy();
    });
*/
/*
    it("should  loop the track when we add a point on the start Point ", () => {
        trackVertices.addVertex(vector1);
        result = listOfPoints.$isComplete();
        expect(result).toBeTruthy();
    });
    */
});
