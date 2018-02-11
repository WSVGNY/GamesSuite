import { Injectable } from "@angular/core";
import { Camera, WebGLRenderer, Scene } from "three";

export enum Action {
    ADD_POINT = 1,
    SET_SELECTED_VERTEX,
    COMPLETE_LOOP,
    NONE,
    REMOVE
}

@Injectable()
export class EditorRenderService {

    private containerEditor: HTMLDivElement;
    private renderer: WebGLRenderer;

    public constructor() {}

    public async initialize(containerEditor: HTMLDivElement, scene: Scene, camera: Camera): Promise<void> {
        if (containerEditor) {
            this.containerEditor = containerEditor;
        }
        await this.initialiseRenderer();
        this.render(scene, camera);
    }

    private async initialiseRenderer(): Promise<void> {
        this.renderer = new WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.containerEditor.clientWidth, this.containerEditor.clientHeight);
        this.containerEditor.appendChild(this.renderer.domElement);
    }

    private render(scene: Scene, camera: Camera): void {
        requestAnimationFrame(() => this.render(scene, camera));
        this.renderer.render(scene, camera);
    }
/*
    public onResize(camera: Camera): void {
        camera.updateProjectionMatrix();
        this.renderer.setSize(this.containerEditor.clientWidth, this.containerEditor.clientHeight);
    }
    */
}
