import { Vector3 } from "three";
import { EditorScene } from "../editorScene";

export abstract class AbstractCommand {
    protected editorScene: EditorScene;
    protected position: Vector3;

    public constructor(editorScene: EditorScene, position: Vector3) {
        this.editorScene = editorScene;
        this.position = position;
    }

    public abstract execute(): void;
}
