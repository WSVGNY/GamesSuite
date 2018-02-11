import { AbstractCommand } from "./abstractCommand";
import {EditorScene } from "../editorScene";

export class CloseLoop extends AbstractCommand {

    public constructor(editorScene: EditorScene) {
        super(editorScene);
    }

    public execute(): void {
        this.editorScene.completeTrack();
    }
}
