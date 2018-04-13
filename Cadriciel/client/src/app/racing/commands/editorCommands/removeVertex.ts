import { AbstractEditorCommand } from "./../abstractEditorCommand";

export class RemoveVertex extends AbstractEditorCommand {
    public execute(): void {
        this._editorScene.removeLastVertex();
    }
}
