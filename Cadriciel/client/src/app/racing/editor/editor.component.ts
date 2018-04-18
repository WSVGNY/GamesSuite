import { Component, AfterViewInit, HostListener, ElementRef, ViewChild, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { Track } from "../../../../../common/racing/track";
import { EditorCamera } from "../cameras/editorCamera";
import { EditorScene } from "../scenes/editorScene";
import { MouseEventHandlerService } from "../event-handlers/mouse-event-handler.service";
import { Vector3 } from "three";
import { TrackType } from "../../../../../common/racing/trackType";
import { RenderService } from "../render-service/render.service";
import { TrackService } from "../track/track-service/track.service";
import { Formater } from "../scoreboard/formater";

const CAMERA_Z_POSITION: number = 480;
const CAMERA_POSITION: Vector3 = new Vector3(0, 0, CAMERA_Z_POSITION);
const VIEW_SIZE: number = 500;

@Component({
    selector: "app-editor",
    templateUrl: "./editor.component.html",
    styleUrls: ["./editor.component.css"]
})

export class EditorComponent implements AfterViewInit, OnInit {

    @ViewChild("containerEditor")
    private _containerRef: ElementRef;
    @Input()
    public currentTrack: Track;
    private _trackChosenFromAdmin: Track;
    private _editorCamera: EditorCamera;
    private _editorScene: EditorScene;

    public constructor(
        private _route: ActivatedRoute,
        private _trackService: TrackService,
        private _location: Location,
        private _editorRenderService: RenderService,
        private _mouseEventHandlerService: MouseEventHandlerService) {
        this.currentTrack = new Track(undefined);
    }

    public ngOnInit(): void {
        this._editorScene = new EditorScene();
    }

    public ngAfterViewInit(): void {
        this.getTrack();
        this._editorCamera = new EditorCamera(this.computeAspectRatio(), VIEW_SIZE);
        this._editorCamera.setPosition(CAMERA_POSITION);
        this._editorRenderService
            .initialize(this._containerRef.nativeElement, this._editorScene, this._editorCamera)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
        this._mouseEventHandlerService
            .initialize(this._containerRef.nativeElement, VIEW_SIZE)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
        this.update();
    }

    private computeAspectRatio(): number {
        return this._containerRef.nativeElement.clientWidth / this._containerRef.nativeElement.clientHeight;
    }

    private update(): void {
        requestAnimationFrame(() => {
            this._editorRenderService.render(this._editorScene, this._editorCamera);
            this.update();
        });
    }

    public getTrack(): void {
        this._trackService.getTrackFromId(this._route.snapshot.paramMap.get("id"))
            .subscribe((trackFromServer: Track) => {
                this._trackChosenFromAdmin = Track.createFromJSON(JSON.stringify(trackFromServer));
                this.currentTrack.name = this._trackChosenFromAdmin.name;
                this.currentTrack.description = this._trackChosenFromAdmin.description;
                this.currentTrack.timesPlayed = this._trackChosenFromAdmin.timesPlayed;
                this.currentTrack.type = this._trackChosenFromAdmin.type;
                this.currentTrack.bestTimes = this._trackChosenFromAdmin.bestTimes;
                this._editorScene.importTrackVertices(this._trackChosenFromAdmin.vertices);
            });
    }

    public saveTrack(): void {
        this._trackChosenFromAdmin.name = this.currentTrack.name;
        this._trackChosenFromAdmin.description = this.currentTrack.description;
        this._trackChosenFromAdmin.vertices = this._editorScene.exportTrackVertices();
        this._trackChosenFromAdmin.type = this.currentTrack.type;
        this._trackService.putTrack(this._trackChosenFromAdmin.id, this._trackChosenFromAdmin)
            .subscribe(() => this.goBack(), (error: Error) => console.error(error));
    }

    public saveTrackName(trackName: string): void {
        this.currentTrack.name = trackName;
    }

    public saveTrackDescription(trackDescription: string): void {
        this.currentTrack.description = trackDescription;
    }

    public getFormatedTime(score: number): string {
        return Formater.formatTime(score);
    }

    public goBack(): void {
        this._location.back();
    }

    public chooseTrackType(): void {
        this.currentTrack.type = this.currentTrack.type === TrackType.Default ? TrackType.Night : TrackType.Default;
    }

    @HostListener("window:mousedown", ["$event"])
    public onMouseDown(event: MouseEvent): void {
        this._mouseEventHandlerService.handleMouseDown(
            event,
            this._editorCamera,
            this._editorScene
        );
    }

    @HostListener("window:mousemove", ["$event"])
    public onMouseMove(event: MouseEvent): void {
        this._mouseEventHandlerService.handleMouseMove(event, this._editorScene);
    }

    @HostListener("window:mouseup", ["$event"])
    public onMouseUp(event: MouseEvent): void {
        this._mouseEventHandlerService.handleMouseUp(event, this._editorScene);
    }

    @HostListener("window:contextmenu", ["$event"])
    public onContextMenu(event: MouseEvent): void {
        this._mouseEventHandlerService.onContextMenu(event);
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this._editorRenderService.onResize();
        this._editorCamera.onResize();
    }
}
