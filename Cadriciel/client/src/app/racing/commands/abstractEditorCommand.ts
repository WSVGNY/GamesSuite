import { EditorScene } from "../editor/editorScene";
import { AbstractCommand } from "./abstractCommand";

export abstract class AbstractEditorCommand extends AbstractCommand {
    protected editorScene: EditorScene;

    public constructor(editorScene: EditorScene) {
        super();
        this.editorScene = editorScene;
    }

    public abstract execute(): void;
}
