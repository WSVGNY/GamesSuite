import { AbstractEditorCommand } from "./../abstractEditorCommand";

export class PlaceVertex extends AbstractEditorCommand {
    public execute(): void {
        this._editorScene.addVertex(this._position);
    }
}
