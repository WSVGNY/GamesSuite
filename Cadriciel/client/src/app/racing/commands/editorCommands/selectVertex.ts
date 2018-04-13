import { AbstractEditorCommand } from "./../abstractEditorCommand";

export class SelectVertex extends AbstractEditorCommand {
    public execute(): void {
        this._editorScene.setSelectedVertex(this._vertexName);
    }
}
