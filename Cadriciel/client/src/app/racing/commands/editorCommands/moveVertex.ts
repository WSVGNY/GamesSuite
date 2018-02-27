import { AbstractEditorCommand } from "./../abstractEditorCommand";
import { Vector3 } from "three";
import { EditorScene } from "../../editor/editorScene";

export class MoveVertex extends AbstractEditorCommand {

    private _position: Vector3;

    public constructor(editorScene: EditorScene, position: Vector3) {
        super(editorScene);
        this._position = position;
    }

    public execute(): void {
        this._editorScene.moveSelectedVertex(this._position);
    }
}
