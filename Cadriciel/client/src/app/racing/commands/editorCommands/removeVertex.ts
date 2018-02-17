import { AbstractEditorCommand } from "./../abstractEditorCommand";
import {EditorScene } from "../../editor/editorScene";

export class RemoveVertex extends AbstractEditorCommand {

    public constructor(editorScene: EditorScene) {
        super(editorScene);
    }

    public execute(): void {
       this._editorScene.removeLastVertex();
    }
}
