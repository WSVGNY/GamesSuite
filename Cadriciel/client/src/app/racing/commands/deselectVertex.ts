import { AbstractCommand } from "./abstractCommand";
import { Vector3 } from "three";
import { EditorScene } from "../editorScene";

export class DeselectVertex extends AbstractCommand {

    public constructor(editorScene: EditorScene, position: Vector3) {
        super(editorScene, position);
    }

    public execute(): void {
        this.editorScene.deselectVertex();
    }
}
