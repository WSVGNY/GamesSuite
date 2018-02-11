import { AbstractCommand } from "./abstractCommand";
import { Vector3 } from "three";
import { EditorScene } from "../editorScene";

export class SelectVertex extends AbstractCommand {

    private vertexName: string;

    public constructor(editorScene: EditorScene, position: Vector3, vertex: string) {
        super(editorScene, position);
        this.vertexName = vertex;
    }

    public execute(): void {
        this.editorScene.setSelectedVertex(this.vertexName);
    }
}
