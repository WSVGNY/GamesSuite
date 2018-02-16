import { AbstractEditorCommand } from "./../abstractEditorCommand";
import { EditorScene } from "../../editor/editorScene";

export class SelectVertex extends AbstractEditorCommand {

    private vertexName: string;

    public constructor(editorScene: EditorScene, vertex: string) {
        super(editorScene);
        this.vertexName = vertex;
    }

    public execute(): void {
        this.editorScene.setSelectedVertex(this.vertexName);
    }
}
