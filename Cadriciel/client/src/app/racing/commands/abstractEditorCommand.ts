import { EditorScene } from "../scenes/editorScene";
import { AbstractCommand } from "./abstractCommand";

export abstract class AbstractEditorCommand extends AbstractCommand {
    protected _editorScene: EditorScene;

    public constructor(editorScene: EditorScene) {
        super();
        this._editorScene = editorScene;
    }

    public abstract execute(): void;
}
