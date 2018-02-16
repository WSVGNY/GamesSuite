import { AbstractEditorCommand } from "./../abstractEditorCommand";
import { EditorScene } from "../../editor/editorScene";

export class DeselectVertex extends AbstractEditorCommand {

    public constructor(editorScene: EditorScene) {
        super(editorScene);
    }

    public execute(): void {
        this.editorScene.deselectVertex();
    }
}
