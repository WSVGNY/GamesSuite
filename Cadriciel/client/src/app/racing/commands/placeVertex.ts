import { AbstractCommand } from "./abstractCommand";
import { Vector3 } from "three";
import { EditorScene } from "../editorScene";

export class PlaceVertex extends AbstractCommand {

    private position: Vector3;

    public constructor(editorScene: EditorScene, position: Vector3) {
        super(editorScene);
        this.position = position;
    }

    public execute(): void {
        this.editorScene.addVertex(this.position);
    }
}
