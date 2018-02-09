import { Injectable } from "@angular/core";
import { Vector3, OrthographicCamera, Scene, Raycaster } from "three";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";

export enum Action {
  ADD_POINT = 1,
  SET_SELECTED_VERTEX,
  COMPLETE_LOOP,
  NONE,
  REMOVE
}

const LEFT_CLICK_KEYCODE: number = 1;
const RIGHT_CLICK_KEYCODE: number = 3;
const HALF: number = 0.5;


@Injectable()
export class MouseEventHandlerService {

  private mouseVector: THREE.Vector3;
  private isMouseDown: boolean = false;
  private trackVertices: TrackVertices;
  private raycaster: Raycaster;
  private selectedVertexName: string = "";
  private containerEditor: HTMLDivElement;

  public constructor() { }

  public async initialize(containerEditor: HTMLDivElement): Promise<void> {
    if (containerEditor) {
        this.containerEditor = containerEditor;
    }
    this.raycaster = new Raycaster();
}

  // private computeMouseCoordinates(positionX: number, positionY: number): boolean {
  private computeMouseCoordinates(position: Vector3, viewSize: number): boolean {
    const offset: Vector3 = new Vector3();
    offset.x = this.containerEditor.offsetLeft + this.containerEditor.clientLeft;
    offset.y = this.containerEditor.offsetTop - document.documentElement.scrollTop + this.containerEditor.clientTop;
    offset.z = 0;

    const center: Vector3 = new Vector3();
    center.x = this.containerEditor.clientWidth * HALF;
    center.y = this.containerEditor.clientHeight * HALF;
    center.z = 0;

    this.mouseVector.x = (position.x - offset.x - center.x) * viewSize / this.containerEditor.clientHeight;
    this.mouseVector.y = -(position.y - offset.y - center.y) * viewSize / this.containerEditor.clientHeight;

    return (position.x > offset.x && position.y > offset.y) ? true : false;
}

  private detectObjectsCollision(camera: OrthographicCamera, scene: Scene): void {
    const direction: Vector3 = this.mouseVector.clone().sub(camera.position).normalize();
    this.raycaster.set(camera.position, direction);
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
