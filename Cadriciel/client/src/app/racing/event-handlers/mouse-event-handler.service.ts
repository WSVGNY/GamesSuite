import { Injectable } from "@angular/core";
import { Vector3, Raycaster } from "three";
import { EditorScene } from "../editorScene";
import { EditorCamera } from "../editorCamera";
import { EditorControl } from "../editorControl";
import { SelectVertex } from "../commands/selectVertex";
import { CloseLoop } from "../commands/closeLoop";
import { PlaceVertex } from "../commands/placeVertex";
import { RemoveVertex } from "../commands/removeVertex";
import { MoveVertex } from "../commands/moveVertex";
import { DeselectVertex } from "../commands/deselectVertex";

const LEFT_CLICK_KEYCODE: number = 1;
const RIGHT_CLICK_KEYCODE: number = 3;
const REQUIRED_VERTEX_COUNT: number = 3;
const HALF: number = 0.5;

@Injectable()
export class MouseEventHandlerService {

  private editorControl: EditorControl;
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
    this.editorControl = new EditorControl();
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
  private clickOnVertex(editorScene: EditorScene): boolean {
    return (this.raycaster.intersectObjects(editorScene.$vertices, true).length) ? true : false;
  }

  private clickOnFirstVertex(editorScene: EditorScene): boolean {
    return (this.raycaster.intersectObject(editorScene.$firstVertex, true).length) ? true : false;
  }

  private clickedVertexName(editorScene: EditorScene): string {
    return this.raycaster.intersectObjects(editorScene.$vertices, true)[0].object.name;
  }

  private handleLeftClick(editorScene: EditorScene): void {
    if (editorScene.$isEmpty) {
        this.editorControl.setCommand(new PlaceVertex(editorScene, this.mouseWorldCoordinates));
        this.editorControl.execute();
    } else if (this.clickOnVertex(editorScene)) {
        if (this.clickOnFirstVertex(editorScene) && editorScene.$nbVertices >= REQUIRED_VERTEX_COUNT) {
            if (editorScene.$isComplete) {
                this.editorControl.setCommand(new SelectVertex(editorScene, this.clickedVertexName(editorScene)));
            } else {
                this.editorControl.setCommand(new CloseLoop(editorScene));
            }
        } else {
            this.editorControl.setCommand(new SelectVertex(editorScene, this.clickedVertexName(editorScene)));
        }
        this.editorControl.execute();
    } else  if (!editorScene.$isComplete) {
        this.editorControl.setCommand(new PlaceVertex(editorScene, this.mouseWorldCoordinates));
        this.editorControl.execute();
    }
}

  public handleMouseDown(event: MouseEvent, editorCamera: EditorCamera, editorScene: EditorScene ): void {
      const mouseScreenCoordinates: Vector3 = new Vector3(event.clientX, event.clientY, 0);
      if (this.isMouseOnScene(mouseScreenCoordinates)) {
            this.convertToWorldCoordinates(mouseScreenCoordinates);
            this.isMouseDown = true;
            switch (event.which) {
                case LEFT_CLICK_KEYCODE:
                    this.setRaycaster(editorCamera);
                    this.handleLeftClick(editorScene);
                    break;
                case RIGHT_CLICK_KEYCODE:
                    if (!editorScene.$isEmpty) {
                        this.editorControl.setCommand(new RemoveVertex(editorScene));
                        this.editorControl.execute();
                    }
                    break;
                default:
            }
      }
}

  public handleMouseMove(event: MouseEvent, editorScene: EditorScene): void {
    const mouseScreenCoordinates: Vector3 = new Vector3(event.clientX, event.clientY, 0);
    if (this.isMouseOnScene(mouseScreenCoordinates)) {
        this.convertToWorldCoordinates(mouseScreenCoordinates);
        if (this.isMouseDown && editorScene.$selectedVertex !== undefined) {
            this.editorControl.setCommand(new MoveVertex(editorScene, this.mouseWorldCoordinates));
            this.editorControl.execute();
        }
    }
}

  public handleMouseUp(event: MouseEvent, editorScene: EditorScene): void {
    const mouseScreenCoordinates: Vector3 = new Vector3(event.clientX, event.clientY, 0);
    if (this.isMouseOnScene(mouseScreenCoordinates)) {
        this.editorControl.setCommand(
            new DeselectVertex(editorScene));
        this.editorControl.execute();
        this.isMouseDown = false;
    }
}

  public onContextMenu(event: MouseEvent): void {
    event.preventDefault();
}
}
