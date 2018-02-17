import { AbstractEditorCommand } from "./../abstractEditorCommand";
import { Vector3 } from "three";
import {EditorScene } from "../../editor/editorScene";

export class MoveVertex extends AbstractEditorCommand {

    private position: Vector3;

    public constructor(editorScene: EditorScene, position: Vector3) {
        super(editorScene);
        this.position = position;
    }

    public execute(): void {
        this._editorScene.moveSelectedVertex(this.position);
    }
}
