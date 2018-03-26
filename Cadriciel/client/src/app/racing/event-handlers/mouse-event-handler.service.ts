import { Injectable } from "@angular/core";
import { Vector3, Raycaster, OrthographicCamera } from "three";
import { CommandController } from "../commands/commandController";
import { SelectVertex } from "../commands/editorCommands/selectVertex";
import { CloseLoop } from "../commands/editorCommands/closeLoop";
import { PlaceVertex } from "../commands/editorCommands/placeVertex";
import { RemoveVertex } from "../commands/editorCommands/removeVertex";
import { MoveVertex } from "../commands/editorCommands/moveVertex";
import { DeselectVertex } from "../commands/editorCommands/deselectVertex";
import { HALF } from "../constants";
import { EditorScene } from "../scenes/editorScene";

const LEFT_CLICK_KEYCODE: number = 1;
const RIGHT_CLICK_KEYCODE: number = 3;
const REQUIRED_VERTEX_COUNT: number = 3;

@Injectable()
export class MouseEventHandlerService {

    private _editorControl: CommandController;
    private _containerEditor: HTMLDivElement;
    private _raycaster: Raycaster;
    private _viewSize: number;

    private _mouseWorldCoordinates: Vector3;
    private _divOffset: Vector3;
    private _centerOffset: Vector3;
    private _selectedVertexName: string;
    private _isMouseDown: boolean;

    public constructor() {
        this._selectedVertexName = "";
        this._isMouseDown = false;
    }

    public async initialize(containerEditor: HTMLDivElement, viewSize: number): Promise<void> {
        if (containerEditor) {
            this._containerEditor = containerEditor;
        }
        await
            this.initialiseValues();
        this._viewSize = viewSize;
    }

    private async initialiseValues(): Promise<void> {
        this._raycaster = new Raycaster();
        this._editorControl = new CommandController();
        this._mouseWorldCoordinates = new Vector3(0, 0, 0);
        this._divOffset = new Vector3(0, 0, 0);
        this._centerOffset = new Vector3(0, 0, 0);
    }

    public get mouseWorldCoordinates(): Vector3 {
        return this._mouseWorldCoordinates;
    }

    public get selectedVertexName(): string {
        return this._selectedVertexName;
    }

    public setSelectedVertexName(editorScene: EditorScene): void {
        this._selectedVertexName = this._raycaster.intersectObjects(editorScene.vertices, true)[0].object.name;
    }

    private convertToWorldCoordinates(position: Vector3): void {
        this._mouseWorldCoordinates.x =
            (position.x - this._divOffset.x - this._centerOffset.x) *
            this._viewSize / this._containerEditor.clientHeight;

        this._mouseWorldCoordinates.y =
            -(position.y - this._divOffset.y - this._centerOffset.y) *
            this._viewSize / this._containerEditor.clientHeight;
    }

    private computeDivOffset(): void {
        this._divOffset.x = this._containerEditor.offsetLeft + this._containerEditor.clientLeft;
        this._divOffset.y = this._containerEditor.offsetTop - document.documentElement.scrollTop + this._containerEditor.clientTop;
        this._divOffset.z = 0;
    }

    private computeCenterOffset(): void {
        this._centerOffset.x = this._containerEditor.clientWidth * HALF;
        this._centerOffset.y = this._containerEditor.clientHeight * HALF;
        this._centerOffset.z = 0;
    }

    private isMouseOnScene(position: Vector3): boolean {
        this.computeDivOffset();
        this.computeCenterOffset();

        return (position.x > this._divOffset.x && position.y > this._divOffset.y) ? true : false;
    }

    private setRaycaster(camera: OrthographicCamera): void {
        const direction: Vector3 = this._mouseWorldCoordinates.clone().sub(camera.position).normalize();
        this._raycaster.set(camera.position, direction);
    }

    private clickOnVertex(editorScene: EditorScene): boolean {
        return (this._raycaster.intersectObjects(editorScene.vertices, true).length) ? true : false;
    }

    private clickOnFirstVertex(editorScene: EditorScene): boolean {
        return (this._raycaster.intersectObject(editorScene.firstVertex, true).length) ? true : false;
    }

    private clickedVertexName(editorScene: EditorScene): string {
        return this._raycaster.intersectObjects(editorScene.vertices, true)[0].object.name;
    }

    private handleLeftClick(editorScene: EditorScene): void {
        if (editorScene.isEmpty) {
            this._editorControl.command = new PlaceVertex(editorScene, this._mouseWorldCoordinates);
            this._editorControl.execute();
        } else if (this.clickOnVertex(editorScene)) {
            if (this.clickOnFirstVertex(editorScene) && editorScene.vertices.length >= REQUIRED_VERTEX_COUNT) {
                this._editorControl.command = editorScene.isComplete ?
                    new SelectVertex(editorScene, this.clickedVertexName(editorScene)) :
                    new CloseLoop(editorScene);
            } else {
                this._editorControl.command = new SelectVertex(editorScene, this.clickedVertexName(editorScene));
            }
            this._editorControl.execute();
        } else if (!editorScene.isComplete) {
            this._editorControl.command = new PlaceVertex(editorScene, this._mouseWorldCoordinates);
            this._editorControl.execute();
        }
    }

    public handleMouseDown(event: MouseEvent, camera: OrthographicCamera, editorScene: EditorScene): void {
        const mouseScreenCoordinates: Vector3 = new Vector3(event.clientX, event.clientY, 0);
        if (this.isMouseOnScene(mouseScreenCoordinates)) {
            this.convertToWorldCoordinates(mouseScreenCoordinates);
            this._isMouseDown = true;
            switch (event.which) {
                case LEFT_CLICK_KEYCODE:
                    this.setRaycaster(camera);
                    this.handleLeftClick(editorScene);
                    break;
                case RIGHT_CLICK_KEYCODE:
                    if (!editorScene.isEmpty) {
                        this._editorControl.command = new RemoveVertex(editorScene);
                        this._editorControl.execute();
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
            if (this._isMouseDown && editorScene.selectedVertex !== undefined) {
                this._editorControl.command = new MoveVertex(editorScene, this._mouseWorldCoordinates);
                this._editorControl.execute();
            }
        }
    }

    public handleMouseUp(event: MouseEvent, editorScene: EditorScene): void {
        const mouseScreenCoordinates: Vector3 = new Vector3(event.clientX, event.clientY, 0);
        if (this.isMouseOnScene(mouseScreenCoordinates)) {
            this._editorControl.command = new DeselectVertex(editorScene);
            this._editorControl.execute();
            this._isMouseDown = false;
        }
    }

    public onContextMenu(event: MouseEvent): void {
        event.preventDefault();
    }
}
