import { AbstractEditorCommand } from "./../abstractEditorCommand";
import { EditorScene } from "../../editor/editorScene";

export class SelectVertex extends AbstractEditorCommand {

    private _vertexName: string;

    public constructor(editorScene: EditorScene, vertex: string) {
        super(editorScene);
        this._vertexName = vertex;
    }

    public execute(): void {
        this._editorScene.setSelectedVertex(this._vertexName);
    }
}
