import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { TrackService } from "../track-service/track.service";
import { TrackStructure } from "../../../../../common/racing/track";
import { EditorRenderService } from "../editor/editor-render-service/editor-render.service";
import { Track } from "../track";
import { PreviewCamera } from "../cameras/previewCamera";
import { PreviewScene } from "../scenes/previewScene";

@Component({
    selector: "app-choose-track",
    templateUrl: "./choose-track.component.html",
    styleUrls: ["./choose-track.component.css"]
})
export class ChooseTrackComponent implements OnInit, AfterViewInit {

    @ViewChild("preview")
    private _containerRef: ElementRef;
    public tracks: Track[] = new Array();

    private _previewCamera: PreviewCamera;
    private _previewScene: PreviewScene;

    public constructor(
        private _trackService: TrackService,
        private _renderService: EditorRenderService
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
    }

    private computeAspectRatio(): number {
        return this._containerRef.nativeElement.clientWidth / this._containerRef.nativeElement.clientHeight;
    }

    private getTracksFromServer(): void {
        this._trackService.getTrackList()
            .subscribe((tracksFromServer: string) => {
                this.tracks = [];
                JSON.parse(tracksFromServer).forEach((document: string) => {
                    const iTrack: TrackStructure = JSON.parse(JSON.stringify(document));
                    this.tracks.push(new Track(iTrack));
                });
            });
    }

    public displayTrackPreview(track: Track): void {
        this._previewScene.clearTrack();
        this._previewScene.loadTrack(track);
    }

    public updateSelectedTrack(track: Track): void {
        track.timesPlayed++;
        this.saveTrack(track);
    }

    private saveTrack(track: Track): void {
        this._trackService.putTrack(track.id, track.toTrackStructure()).subscribe();
    }
}
