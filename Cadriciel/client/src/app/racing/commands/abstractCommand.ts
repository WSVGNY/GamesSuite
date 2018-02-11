import { EditorScene } from "../editorScene";

export abstract class AbstractCommand {
    protected editorScene: EditorScene;

    public constructor(editorScene: EditorScene) {
        this.editorScene = editorScene;
    }

    public abstract execute(): void;
}
