import { Component, AfterViewInit, HostListener, ElementRef, ViewChild, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Track } from "../../../../../common/racing/track";
import { TrackService } from "../track-service/track.service";
import { EditorCamera } from "../editorCamera";
import { EditorScene } from "../editorScene";
import { EditorRenderService } from "../editor-render-service/editor-render.service";
import { MouseEventHandlerService } from "../event-handlers/mouse-event-handler.service";
import { Vector3 } from "three";
import { Action } from "../action";

const CAMERA_Z_POSITION: number = 480;
const CAMERA_POSITION: Vector3 = new Vector3(0, 0, CAMERA_Z_POSITION);
const VIEW_SIZE: number = 1000;

@Component({
    selector: "app-editor",
    templateUrl: "./editor.component.html",
    styleUrls: ["./editor.component.css"]
})

export class EditorComponent implements AfterViewInit, OnInit {

    @ViewChild("containerEditor")
    private containerRef: ElementRef;
    @Input()
    private currentTrackName: string = "New Track";
    private trackChosenFromAdmin: Track;

    private action: Action = Action.NONE;
    private editorCamera: EditorCamera;
    private editorScene: EditorScene;

    public constructor(
        private route: ActivatedRoute,
        private trackService: TrackService,
        private location: Location,
        private editorRenderService: EditorRenderService,
        private mouseEventHandlerService: MouseEventHandlerService,
    ) { }

    public async ngOnInit(): Promise<void> {
        await this.getTrack();
    }

    public ngAfterViewInit(): void {
        this.getTrack();
        this.editorCamera = new EditorCamera(this.computeAspectRatio(), VIEW_SIZE);
        this.editorCamera.setPosition(CAMERA_POSITION);
        this.editorScene = new EditorScene();
        this.editorRenderService
            .initialize(this.containerRef.nativeElement, this.editorScene.$scene, this.editorCamera.$camera)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
        this.mouseEventHandlerService
            .initialize(this.containerRef.nativeElement, VIEW_SIZE)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
    }

    private computeAspectRatio(): number {
        return this.containerRef.nativeElement.clientWidth / this.containerRef.nativeElement.clientHeight;
    }

    public getTrack(): void {
        const id: number = +this.route.snapshot.paramMap.get("id");
        this.trackService.getTrackFromId(id)
            .subscribe((track: Track) => {
                this.trackChosenFromAdmin = new Track(track["id"], track["name"]);
                this.currentTrackName = this.trackChosenFromAdmin.$name;
            });
    }

    public saveTrack(): void {
        this.trackChosenFromAdmin.$name = this.currentTrackName;
        this.trackService.putTrack(this.trackChosenFromAdmin)
            .subscribe((track: Track) => {
                this.trackChosenFromAdmin = new Track(track["id"], track["name"]);
            });
    }

    public saveTrackName(trackName: string): void {
        this.currentTrackName = trackName;
    }

    public goBack(): void {
        this.location.back();
    }

    private computeAction(): void {
        switch (this.action) {
            case Action.ADD_VERTEX:
                this.editorScene.addVertex(this.mouseEventHandlerService.$mouseWorldCoordinates);
                break;
            case Action.REMOVE_VERTEX:
                this.editorScene.removeLastVertex();
                break;
            case Action.MOVE_VERTEX:
                this.editorScene.moveVertex(
                    this.mouseEventHandlerService.$selectedVertexName,
                    this.mouseEventHandlerService.$mouseWorldCoordinates
                );
                break;
            case Action.SET_SELECTED_VERTEX:
                this.mouseEventHandlerService.setSelectedVertexName(this.editorScene);
                break;
            case Action.COMPLETE_TRACK:
                this.editorScene.completeTrack();
                break;
            default:
        }
    }

    @HostListener("window:mousedown", ["$event"])
    public onMouseDown(event: MouseEvent): void {
        this.action = this.mouseEventHandlerService.handleMouseDown(
            event,
            this.editorCamera,
            this.editorScene
        );
        this.computeAction();
    }

    @HostListener("window:mousemove", ["$event"])
    public onMouseMove(event: MouseEvent): void {
        this.action = this.mouseEventHandlerService.handleMouseMove(event);
        this.computeAction();
    }

    @HostListener("window:mouseup", ["$event"])
    public onMouseUp(event: MouseEvent): void {
        this.mouseEventHandlerService.handleMouseUp(event);
    }

    @HostListener("window:contextmenu", ["$event"])
    public onContextMenu(event: MouseEvent): void {
        this.mouseEventHandlerService.onContextMenu(event);
    }
/*
    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.editorRenderService.onResize();
    }
    */
}
