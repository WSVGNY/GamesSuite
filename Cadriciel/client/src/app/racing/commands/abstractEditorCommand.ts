import { EditorScene } from "../scenes/editorScene";
import { AbstractCommand } from "./abstractCommand";
import { Vector3 } from "three";

export abstract class AbstractEditorCommand extends AbstractCommand {

    public constructor(protected _editorScene: EditorScene, protected _vertexName?: string, protected _position?: Vector3) {
        super();
    }

    public abstract execute(): void;
}
