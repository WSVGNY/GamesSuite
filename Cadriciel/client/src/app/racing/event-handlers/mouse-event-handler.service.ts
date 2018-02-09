import { Injectable } from "@angular/core";
import { Vector3, Raycaster } from "three";
import { EditorScene } from "../editorScene";
import { EditorCamera } from "../editorCamera";
import { Action } from "../action";

const LEFT_CLICK_KEYCODE: number = 1;
const RIGHT_CLICK_KEYCODE: number = 3;
const HALF: number = 0.5;

@Injectable()
export class MouseEventHandlerService {

  private containerEditor: HTMLDivElement;
  private raycaster: Raycaster;
  private viewSize: number;

  private mouseWorldCoordinates: Vector3;
  private divOffset: Vector3;
  private centerOffset: Vector3;
  private selectedVertexName: string = "";
  private isMouseDown: boolean = false;

  public constructor() {}

  public async initialize(containerEditor: HTMLDivElement, viewSize: number): Promise<void> {
    if (containerEditor) {
        this.containerEditor = containerEditor;
    }
    await
    this.initialiseValues();
    this.viewSize = viewSize;
}

  private async initialiseValues(): Promise<void> {
    this.raycaster = new Raycaster();
    this.mouseWorldCoordinates = new Vector3(0, 0, 0);
    this.divOffset = new Vector3(0, 0, 0);
    this.centerOffset = new Vector3(0, 0, 0);
}

  public get $mouseWorldCoordinates(): Vector3 {
    return this.mouseWorldCoordinates;
}

  public get $selectedVertexName(): string {
      return this.selectedVertexName;
  }

  public setSelectedVertexName(editorScene: EditorScene): void {
    this.selectedVertexName = this.raycaster.intersectObjects(editorScene.$vertices, true)[0].object.name;
}

  private convertToWorldCoordinates(position: Vector3): void {
    this.mouseWorldCoordinates.x =
        (position.x - this.divOffset.x - this.centerOffset.x) *
        this.viewSize / this.containerEditor.clientHeight;

    this.mouseWorldCoordinates.y =
        -(position.y - this.divOffset.y - this.centerOffset.y) *
        this.viewSize / this.containerEditor.clientHeight;
}

  private computeDivOffset(): void {
    this.divOffset.x = this.containerEditor.offsetLeft + this.containerEditor.clientLeft;
    this.divOffset.y = this.containerEditor.offsetTop - document.documentElement.scrollTop + this.containerEditor.clientTop;
    this.divOffset.z = 0;
}

  private computeCenterOffset(): void {
    this.centerOffset.x = this.containerEditor.clientWidth * HALF;
    this.centerOffset.y = this.containerEditor.clientHeight * HALF;
    this.centerOffset.z = 0;
}

  private isMouseOnScene(position: Vector3): boolean {
    this.computeDivOffset();
    this.computeCenterOffset();

    return (position.x > this.divOffset.x && position.y > this.divOffset.y) ? true : false;
}

  private setRaycaster(editorCamera: EditorCamera): void {
    const direction: Vector3 = this.mouseWorldCoordinates.clone().sub(editorCamera.$camera.position).normalize();
    this.raycaster.set(editorCamera.$camera.position, direction);
}

  private computeWhichLeftClickAction(editorScene: EditorScene): Action {
    if (!editorScene.$isEmpty) {
        if (this.raycaster.intersectObject(editorScene.$firstVertex, true).length) {
            return (editorScene.$isComplete) ? Action.SET_SELECTED_VERTEX : Action.COMPLETE_TRACK;
        } else if (this.raycaster.intersectObjects(editorScene.$vertices, true).length) {
            return Action.SET_SELECTED_VERTEX;
        } else  if (!editorScene.$isComplete) {
            return Action.ADD_VERTEX;
        }
    } else {
        return Action.ADD_VERTEX;
    }

    return Action.NONE;
}

  public handleMouseDown(event: MouseEvent, editorCamera: EditorCamera, editorScene: EditorScene ): Action {
      const mouseScreenCoordinates: Vector3 = new Vector3(event.clientX, event.clientY, 0);
      if (this.isMouseOnScene(mouseScreenCoordinates)) {
            this.convertToWorldCoordinates(mouseScreenCoordinates);
            this.isMouseDown = true;
            switch (event.which) {
                case LEFT_CLICK_KEYCODE:
                    this.setRaycaster(editorCamera);

                    return this.computeWhichLeftClickAction(editorScene);
                case RIGHT_CLICK_KEYCODE:
                    return (editorScene.$isEmpty) ? Action.NONE :  Action.REMOVE_VERTEX;
                default:
                    return Action.NONE;
            }
      }

      return Action.NONE;
}

  public handleMouseMove(event: MouseEvent): Action {
    const mouseScreenCoordinates: Vector3 = new Vector3(event.clientX, event.clientY, 0);
    if (this.isMouseOnScene(mouseScreenCoordinates)) {
        this.convertToWorldCoordinates(mouseScreenCoordinates);
        if (this.isMouseDown && this.selectedVertexName !== "none") {
            return Action.MOVE_VERTEX;
        }
    }

    return Action.NONE;
}

  public handleMouseUp(event: MouseEvent): void {
    const mouseScreenCoordinates: Vector3 = new Vector3(event.clientX, event.clientY, 0);
    if (this.isMouseOnScene(mouseScreenCoordinates)) {
        this.isMouseDown = false;
        this.selectedVertexName = "none";
    }
}

  public onContextMenu(event: MouseEvent): void {
    event.preventDefault();
}
}
