import { AbstractEditorCommand } from "./../abstractEditorCommand";

export class DeselectVertex extends AbstractEditorCommand {
    public execute(): void {
        this._editorScene.deselectVertex();
    }
}
