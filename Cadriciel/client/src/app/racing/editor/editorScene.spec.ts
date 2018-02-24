import { EditorScene, VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL } from "./editorScene";
import { Vector3, Scene, Mesh } from "three";

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
        const receivedPosition: Vector3 = editorScene["_scene"].getChildByName("Start").position;
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

    it("should remove the last point added to the scene", ()  => {
        const testScene: Scene = new Scene();
        const vertex: Mesh = new Mesh(VERTEX_GEOMETRY, SIMPLE_VERTEX_MATERIAL);
        vertex.position.set(0, 0, 0 );
        testScene.add(vertex);
        editorScene["_vertices"].push(vertex);
        editorScene["_scene"] = testScene;
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
        editorScene["_scene"] = testScene;
        editorScene.removeLastVertex();
        expect(editorScene["_lastVertex"]).toEqual(vertex1);
    });
});
