import { AbstractEditorCommand } from "./../abstractEditorCommand";

export class MoveVertex extends AbstractEditorCommand {
    public execute(): void {
        this._editorScene.moveSelectedVertex(this._position);
    }
}
