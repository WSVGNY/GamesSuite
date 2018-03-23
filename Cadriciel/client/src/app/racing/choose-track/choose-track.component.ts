import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { TrackService } from "../track-service/track.service";
import { Track } from "../../../../../common/racing/track";
import { PreviewCamera } from "../cameras/previewCamera";
import { PreviewScene } from "../scenes/previewScene";
import { RenderService } from "../render-service/render.service";

@Component({
    selector: "app-choose-track",
    templateUrl: "./choose-track.component.html",
    styleUrls: ["./choose-track.component.css"]
})
export class ChooseTrackComponent implements OnInit, AfterViewInit {

    @ViewChild("preview")
    private _containerRef: ElementRef;
    public tracks: Track[] = [];

    private _previewCamera: PreviewCamera;
    private _previewScene: PreviewScene;

    public constructor(
        private _trackService: TrackService,
        private _renderService: RenderService
    ) { }

    public ngOnInit(): void {
        this.getTracksFromServer();
        this._previewScene = new PreviewScene();
    }

    public ngAfterViewInit(): void {
        this._previewCamera = new PreviewCamera(this.computeAspectRatio());
        this._renderService
            .initialize(this._containerRef.nativeElement, this._previewScene, this._previewCamera)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
        this.update();
    }

    private computeAspectRatio(): number {
        return this._containerRef.nativeElement.clientWidth / this._containerRef.nativeElement.clientHeight;
    }

    private update(): void {
        requestAnimationFrame(() => {
            this._renderService.render(this._previewScene, this._previewCamera);
            this.update();
        });
    }

    private getTracksFromServer(): void {
        this._trackService.getTrackList()
            .subscribe((tracksFromServer: Track[]) => {
                this.tracks = [];
                tracksFromServer.forEach((document: Track) => {
                    this.tracks.push(Track.createFromJSON(JSON.stringify(document)));
                });
            });
    }

    public displayTrackPreview(track: Track): void {
        this._previewScene.loadTrack(track);
    }

    public updateSelectedTrack(track: Track): void {
        track.timesPlayed++;
        this.saveTrack(track);
    }

    private saveTrack(track: Track): void {
        this._trackService.putTrack(track.id, track).subscribe();
    }
}
