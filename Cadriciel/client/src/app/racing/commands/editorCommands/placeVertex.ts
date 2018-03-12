import { AbstractEditorCommand } from "./../abstractEditorCommand";
import { Vector3 } from "three";
import { EditorScene } from "../../scenes/editorScene";

export class PlaceVertex extends AbstractEditorCommand {

    private _position: Vector3;

    public constructor(editorScene: EditorScene, position: Vector3) {
        super(editorScene);
        this._position = position;
    }

    public execute(): void {
        this._editorScene.addVertex(this._position);
    }
}
