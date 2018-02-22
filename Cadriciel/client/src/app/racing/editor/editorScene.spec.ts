import { EditorScene } from "./editorScene";
import { Vector3, Mesh } from "three";

// tslint:disable:no-magic-numbers

const editorScene: EditorScene = new EditorScene();

describe("Editor Scene", () => {
    it("should be instantiable", () => {
        expect(editorScene).toBeTruthy();
    });

    it("should create Mesh vertex with createVertex()", () => {
        const position: Vector3 = new Vector3(0, 0, 0);
        const vertex: Mesh = editorScene["createVertex"](position);
        expect(vertex).toBeTruthy();
    });

    it("should keep first entered vertex as firstVertex", () => {
        const position: Vector3 = new Vector3(0, 0, 0);
        const position2: Vector3 = new Vector3(0, 1, 0);
        editorScene.addVertex(position);
        const first: Mesh = editorScene["_firstVertex"];
        editorScene.addVertex(position2);
        expect(editorScene["_firstVertex"]).toEqual(first);
    });
});
