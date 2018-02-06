import { Injectable } from "@angular/core";
import {
    Vector2, Vector3, OrthographicCamera,
    WebGLRenderer, Scene, AmbientLight, Raycaster
} from "three";
import { TrackVertices } from "../trackVertices";

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
    private raycaster: Raycaster;
    private trackVertices: TrackVertices;
    private isMouseDown: boolean = false;
    private selectedVertexName: string = "";

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
        this.raycaster = new Raycaster();
        this.trackVertices = new TrackVertices(this.scene);
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

    public getScene(): Scene {
         return this.scene;
    }

    private computeMouseCoordinates(posX: number, posY: number): boolean {
        const offset: Vector2 = new Vector2();
        offset.x = this.containerEditor.offsetLeft + this.containerEditor.clientLeft;
        offset.y = this.containerEditor.offsetTop - document.documentElement.scrollTop + this.containerEditor.clientTop;

        const center: Vector2 = new Vector2();
        center.x = this.containerEditor.clientWidth * HALF;
        center.y = this.containerEditor.clientHeight * HALF;

        this.mouseVector.x = (posX - offset.x - center.x) * VIEW_SIZE / this.containerEditor.clientHeight;
        this.mouseVector.y = -(posY - offset.y - center.y) * VIEW_SIZE / this.containerEditor.clientHeight;

        return (posX > offset.x && posY > offset.y) ? true : false;
    }

    private detectObjectsCollision(): void {
        const direction: Vector3 = this.mouseVector.clone().sub(this.camera.position).normalize();
        this.raycaster.set(this.camera.position, direction);
    }

    private computeLeftClickAction(): Action {
        if (this.trackVertices.isEmpty()) {
            return Action.ADD_POINT;
        } else {
            if (this.raycaster.intersectObject(this.trackVertices.getFirstVertex(), true).length) {
                if (this.trackVertices.$isComplete()) {
                    return Action.SET_SELECTED_VERTEX;
                } else {
                    return Action.COMPLETE_LOOP;
                }
            } else if (this.raycaster.intersectObjects(this.trackVertices.getVertices(), true).length) {
                return Action.SET_SELECTED_VERTEX;
            } else {
                if (!this.trackVertices.$isComplete()) {
                    return Action.ADD_POINT;
                }
            }
        }

        return Action.NONE;
    }

    private computeAction(actionId: Action): void {
        switch (actionId) {
            case Action.ADD_POINT:
                this.trackVertices.addVertex(this.mouseVector);
                break;
            case Action.SET_SELECTED_VERTEX:
                this.selectedVertexName = this.raycaster.intersectObjects(this.trackVertices.getVertices(), true)[0].object.name;
                break;
            case Action.COMPLETE_LOOP:
                this.trackVertices.completeLoop();
                break;
            default:
        }
    }

    public handleMouseDown(buttonId: number, x: number, y: number): Action {
        if (this.computeMouseCoordinates(x, y)) {
            this.isMouseDown = true;
            switch (buttonId) {
                case LEFT_CLICK_KEYCODE:
                    this.detectObjectsCollision();
                    const operation: Action = this.computeLeftClickAction();
                    this.computeAction(operation);

                    return operation;
                case RIGHT_CLICK_KEYCODE:
                    this.trackVertices.removeLastVertex();

                    return Action.REMOVE;
                default:
                    return Action.NONE;
            }
        }

        return Action.NONE;
    }

    public handleMouseMove(x: number, y: number): void {
        if (this.computeMouseCoordinates(x, y)) {
            if (this.isMouseDown && this.selectedVertexName !== "none") {
                this.trackVertices.moveVertex(this.selectedVertexName, this.mouseVector);
            }
        }
    }

    public handleMouseUp(x: number, y: number): void {
        if (this.computeMouseCoordinates(x, y)) {
            this.isMouseDown = false;
            this.selectedVertexName = "none";
        }
    }

    public onContextMenu(event: MouseEvent): void {
        event.preventDefault();
    }
}
