import { Injectable } from "@angular/core";
import { Camera, WebGLRenderer, Scene } from "three";

export enum Action {
    AddPoint = 1,
    SetSelectedVertex,
    CompleteLoop,
    None,
    Remove
}

@Injectable()
export class EditorRenderService {

    private _containerEditor: HTMLDivElement;
    private _renderer: WebGLRenderer;

    public async initialize(containerEditor: HTMLDivElement, scene: Scene, camera: Camera): Promise<void> {
        if (containerEditor) {
            this._containerEditor = containerEditor;
        }
        await this.initialiseRenderer();
        this.render(scene, camera);
    }

    private async initialiseRenderer(): Promise<void> {
        this._renderer = new WebGLRenderer();
        this._renderer.setPixelRatio(devicePixelRatio);
        this._renderer.setSize(this._containerEditor.clientWidth, this._containerEditor.clientHeight);
        this._containerEditor.appendChild(this._renderer.domElement);
    }

    private render(scene: Scene, camera: Camera): void {
        requestAnimationFrame(() => this.render(scene, camera));
        this._renderer.render(scene, camera);
    }

}
