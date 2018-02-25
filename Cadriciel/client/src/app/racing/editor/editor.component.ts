import { Component, AfterViewInit, HostListener, ElementRef, ViewChild, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Track, ITrack } from "../../../../../common/racing/track";
import { TrackService } from "../track-service/track.service";
import { EditorCamera } from "./editorCamera";
import { EditorScene } from "./editorScene";
import { EditorRenderService } from "./editor-render-service/editor-render.service";
import { MouseEventHandlerService } from "../event-handlers/mouse-event-handler.service";
import { Vector3 } from "three";

const CAMERA_Z_POSITION: number = 480;
const CAMERA_POSITION: Vector3 = new Vector3(0, 0, CAMERA_Z_POSITION);
const VIEW_SIZE: number = 600;

@Component({
    selector: "app-editor",
    templateUrl: "./editor.component.html",
    styleUrls: ["./editor.component.css"]
})

export class EditorComponent implements AfterViewInit {

    @ViewChild("containerEditor")
    private containerRef: ElementRef;
    @Input()
    private currentTrackName: string = "New Track";
    private currentTrackDescription: string = "New Description";
    private currentTrackId: string = "";
    private currentTrackTimesPlayed: number = 0;
    private trackChosenFromAdmin: Track;

    private editorCamera: EditorCamera;
    private editorScene: EditorScene;

    public constructor(
        private route: ActivatedRoute,
        private trackService: TrackService,
        private location: Location,
        private editorRenderService: EditorRenderService,
        private mouseEventHandlerService: MouseEventHandlerService,
    ) { }

    public ngAfterViewInit(): void {
        this.getTrack();
        this.editorCamera = new EditorCamera(this.computeAspectRatio(), VIEW_SIZE);
        this.editorCamera.setPosition(CAMERA_POSITION);
        this.editorScene = new EditorScene();
        this.editorRenderService
            .initialize(this.containerRef.nativeElement, this.editorScene.scene, this.editorCamera.camera)
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
        this.currentTrackId = this.route.snapshot.paramMap.get("id");
        this.trackService.getTrackFromId(this.currentTrackId)
            .subscribe((trackFromServer: string) => {
                const iTrack: ITrack = JSON.parse(JSON.stringify(trackFromServer));
                this.trackChosenFromAdmin = new Track(iTrack);
                this.currentTrackName = this.trackChosenFromAdmin.name;
                this.currentTrackDescription = this.trackChosenFromAdmin.description;
                this.currentTrackTimesPlayed = this.trackChosenFromAdmin.timesPlayed;
                this.editorScene.importTrackVertices(this.trackChosenFromAdmin.vertices);
            });
    }

    public saveTrack(): void {
        this.trackChosenFromAdmin.name = this.currentTrackName;
        this.trackChosenFromAdmin.description = this.currentTrackDescription;
        this.trackChosenFromAdmin.vertices = this.editorScene.exportTrackVertices();
        this.trackService.putTrack(this.currentTrackId, this.trackChosenFromAdmin).subscribe();
    }

    public saveTrackName(trackName: string): void {
        this.currentTrackName = trackName;
    }

    public saveTrackDescription(trackDescription: string): void {
        this.currentTrackDescription = trackDescription;
    }

    public goBack(): void {
        this.location.back();
    }

    @HostListener("window:mousedown", ["$event"])
    public onMouseDown(event: MouseEvent): void {
        this.mouseEventHandlerService.handleMouseDown(
            event,
            this.editorCamera,
            this.editorScene
        );
    }

    @HostListener("window:mousemove", ["$event"])
    public onMouseMove(event: MouseEvent): void {
        this.mouseEventHandlerService.handleMouseMove(event, this.editorScene);
    }

    @HostListener("window:mouseup", ["$event"])
    public onMouseUp(event: MouseEvent): void {
        this.mouseEventHandlerService.handleMouseUp(event, this.editorScene);
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
