import { EditorScene } from "./editorScene";
import { Vector3, Scene, Mesh, Geometry, Line } from "three";
import { VERTEX_GEOMETRY } from "../constants/scene.constants";
import { SIMPLE_VERTEX_MATERIAL, SIMPLE_LINE_MATERIAL } from "../constants/texture.constants";

// tslint:disable:no-magic-numbers
describe("Editor Scene", () => {

    let editorScene: EditorScene;

    beforeEach(() => {
        editorScene = new EditorScene();
    });

    it("should be instantiable", () => {
        expect(editorScene).toBeTruthy();
    });

    it("should create Mesh vertex with createVertex()", () => {
        const position: Vector3 = new Vector3(0, 0, 0);
        const vertex: Mesh = editorScene["createVertex"](position);
        expect(vertex).toBeTruthy();
    });

    it("should add vertex at the right position with addVertex()", () => {
        const position: Vector3 = new Vector3(0, 0, 0);
        editorScene.addVertex(position);
        const receivedPosition: Vector3 = editorScene.getChildByName("Start").position;
        expect(position).toEqual(receivedPosition);
    });

    it("should keep first entered vertex as firstVertex when adding a new point", () => {
        const position: Vector3 = new Vector3(0, 0, 0);
        const position2: Vector3 = new Vector3(0, 1, 0);
        editorScene.addVertex(position);
        const first: Mesh = editorScene["_firstVertex"];
        editorScene.addVertex(position2);
        expect(editorScene["_firstVertex"]).toEqual(first);
    });

    it("should remove the last point added to the scene", () => {
        const testScene: Scene = new Scene();
        const vertex: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex.position.set(0, 0, 0);
        testScene.add(vertex);
        editorScene["_vertices"].push(vertex);
        editorScene["children"] = testScene["children"];
        editorScene.removeLastVertex();
        expect(testScene.children.length).toBeFalsy();
    });

    it("should update lastVertex when adding a point", () => {
        const position: Vector3 = new Vector3(0, 0, 0);
        editorScene.addVertex(position);
        const last: Mesh = editorScene["_firstVertex"];
        expect(editorScene["_lastVertex"]).toEqual(last);
    });

    it("should update lastVertex when removing a point", () => {
        const testScene: Scene = new Scene();
        const vertex1: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        const vertex2: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex1.position.set(0, 0, 0);
        vertex2.position.set(0, 1, 0);
        testScene.add(vertex1);
        testScene.add(vertex2);
        editorScene["_vertices"].push(vertex1);
        editorScene["_vertices"].push(vertex2);
        editorScene["children"] = testScene["children"];
        editorScene.removeLastVertex();
        expect(editorScene["_lastVertex"]).toEqual(vertex1);
    });

    it("should create a connection between two points", () => {
        const vertex0: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        const vertex1: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex0.position.set(0, 0, 0);
        vertex1.position.set(1, 1, 0);
        editorScene.addConnection(vertex0, vertex1);
        expect(editorScene.getChildByName("connection0")).toBeDefined();
    });

    it("should remove the last connection added to the scene", () => {
        const LINE_GEOMETRY: Geometry = new Geometry();
        LINE_GEOMETRY.vertices.push(new Vector3(0, 0, 0));
        LINE_GEOMETRY.vertices.push(new Vector3(1, 1, 0));
        const connection: Line = new Line(LINE_GEOMETRY, SIMPLE_LINE_MATERIAL);
        editorScene["_connections"].push(connection);
        const testScene: Scene = new Scene();
        testScene.add(connection);
        editorScene["children"] = testScene["children"];
        editorScene.removeLastVertex();
        expect(editorScene.children.length).toBeFalsy();
    });

    it("should update the position of a dragged point", () => {
        const vertex: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex.position.set(0, 0, 0);
        vertex.name = "vertex0";
        editorScene["_vertices"].push(vertex);
        const testScene: Scene = new Scene();
        testScene.add(vertex);
        editorScene["children"] = testScene["children"];
        const VXY: number = 2;
        editorScene.setVertexPosition(editorScene.getObjectByName("vertex0") as Mesh, new Vector3(VXY, VXY, 0));
        expect(editorScene.getObjectByName("vertex0").position).toEqual(new Vector3(VXY, VXY, 0));
    });

    it("should set _isComplete to true upon completition of the track", () => {
        const vertex0: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        const vertex1: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex0.position.set(0, 0, 0);
        vertex1.position.set(0, 20, 0);
        editorScene["_vertices"].push(vertex0);
        editorScene["_vertices"].push(vertex1);
        editorScene["_firstVertex"] = vertex0;
        editorScene["_lastVertex"] = vertex1;
        editorScene.completeTrack();
        expect(editorScene["_isComplete"]).toEqual(true);
    });

    it("should create a connection between the last and first vertex upon completition of the track", () => {
        const vertex0: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        const vertex1: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex0.position.set(0, 0, 0);
        vertex1.position.set(0, 20, 0);
        editorScene["_vertices"].push(vertex0);
        editorScene["_vertices"].push(vertex1);
        editorScene["_firstVertex"] = vertex0;
        editorScene["_lastVertex"] = vertex1;
        editorScene.completeTrack();
        expect(editorScene.getChildByName("connection0")).toBeDefined();
    });
});
