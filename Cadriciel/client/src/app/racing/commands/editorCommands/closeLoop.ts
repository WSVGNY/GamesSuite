import { AbstractEditorCommand } from "./../abstractEditorCommand";

export class CloseLoop extends AbstractEditorCommand {
    public execute(): void {
        this._editorScene.completeTrack();
    }
}
