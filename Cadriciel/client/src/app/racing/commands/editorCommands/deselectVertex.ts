import { AbstractEditorCommand } from "./../abstractEditorCommand";
import { EditorScene } from "../../scenes/editorScene";

export class DeselectVertex extends AbstractEditorCommand {

    public constructor(editorScene: EditorScene) {
        super(editorScene);
    }

    public execute(): void {
        this._editorScene.deselectVertex();
    }
}
