import { TrackVertices, VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL, LINE_MATERIAL } from "./trackVertices";
import { Scene, Vector3, Mesh, Geometry, Line } from "three";

describe("TrackVertices", () => {
    let scene: Scene;
    let trackVertices: TrackVertices;

    beforeEach(() => {
        scene = new Scene();
        trackVertices = new TrackVertices(scene);
    });

    it("should cerate a point in the scene", ()  => {
        trackVertices.addVertex(new Vector3( 0, 0, 0 ));
        expect(scene.getChildByName("vertex0") === null).toBeFalsy();
    });

    it("should create a connection between two points", ()  => {
        const vertex0: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        const vertex1: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex0.position.set(0, 0, 0 );
        vertex1.position.set(0, 0, 0 );
        trackVertices.addConnection(vertex0, vertex1);
        expect(scene.getChildByName("connection0").name === null).toBeFalsy();
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
        LINE_GEOMETRY.vertices.push(new Vector3(1, 1, 1));
        const connection: Line = new Line(LINE_GEOMETRY, LINE_MATERIAL);
        trackVertices["connections"].push(connection);
        scene.add(connection);
        trackVertices.removeLastVertex();
        expect(scene.children.length).toBeFalsy();
    });

    /*it("should remove a point from the list of points and the connection assiciated this it", () => {
        trackVerticies.removeLastVertex();
        result = scene.getChildByName("vertex1").name === "vertex1" || scene.getChildByName("connection1").name === "connexion1" ;
        expect(result).toBeFalsy();
    });

    it("should  a second and a third point plus the connextion between them", () => {
        trackVerticies.addVertex(vector2);
        trackVerticies.addVertex(vector3);
        result = scene.getChildByName("vertex1").name === "vertex1"
        && scene.getChildByName("vertex2").name === "vertex2"
        && scene.getChildByName("connection1").name === "connexion1"
        && scene.getChildByName("connection2").name === "connexion2";
        expect(result).toBeTruthy();
    });

    it("should  loop the track when we add a point on the start Point ", () => {
        trackVerticies.addVertex(vector1);
        result = listOfPoints.$isComplete();
        expect(result).toBeTruthy();
    });*/
});
