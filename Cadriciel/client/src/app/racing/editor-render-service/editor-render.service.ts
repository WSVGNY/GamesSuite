import { Injectable } from "@angular/core";
import {
    Vector2, Vector3, OrthographicCamera,
    WebGLRenderer, Scene, AmbientLight, Raycaster
} from "three";
import { TrackVertices } from "../trackVertices";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";

export enum Action {
    ADD_POINT = 1,
    SET_SELECTED_VERTEX,
    COMPLETE_LOOP,
    NONE,
    REMOVE
}

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const CAMERA_Z_POSITION: number = 480;
const VIEW_SIZE: number = 1000;
const LEFT_CLICK_KEYCODE: number = 1;
const RIGHT_CLICK_KEYCODE: number = 3;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
const HALF: number = 0.5;

@Injectable()
export class EditorRenderService {

    private mouseVector: THREE.Vector3;
    private camera: OrthographicCamera;
    private aspectRatio: number = 0;
    private containerEditor: HTMLDivElement;
    private scene: THREE.Scene;
    private renderer: WebGLRenderer;

    public constructor() {
        this.mouseVector = new Vector3(0, 0, 0);
    }

    public async initialize(containerEditor: HTMLDivElement): Promise<void> {
        if (containerEditor) {
            this.containerEditor = containerEditor;
        }
        await this.createScene();
        this.startRenderingLoop();
    }

    private async createScene(): Promise<void> {
        this.scene = new Scene();
        // this.trackVertices = new TrackVertices(this.scene);
        this.aspectRatio = this.containerEditor.clientWidth / this.containerEditor.clientHeight;
        this.camera = new OrthographicCamera(
            -this.aspectRatio * VIEW_SIZE * HALF,
            this.aspectRatio * VIEW_SIZE * HALF,
            VIEW_SIZE * HALF,
            -VIEW_SIZE * HALF,
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE);
        this.camera.position.set(0, 0, CAMERA_Z_POSITION);
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
    }

    private startRenderingLoop(): void {
        this.renderer = new WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.containerEditor.clientWidth, this.containerEditor.clientHeight);
        this.containerEditor.appendChild(this.renderer.domElement);
        this.render();
    }

    private render(): void {
        requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene, this.camera);
    }

    public onResize(): void {
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.containerEditor.clientWidth, this.containerEditor.clientHeight);
    }

    public getScene(): Observable<Scene> {
         return of(this.scene);
    }
/*
    public getHeroes(): Observable<Hero[]> {
        return of(HEROES);
      }
*/
}
