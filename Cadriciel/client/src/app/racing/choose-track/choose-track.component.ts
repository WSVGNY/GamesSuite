import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { Track } from "../../../../../common/racing/track";
import { PreviewCamera } from "../cameras/previewCamera";
import { PreviewScene } from "../scenes/previewScene";
import { RenderService } from "../render-service/render.service";
import { TrackService } from "../track/track-service/track.service";

const SECONDS_TO_HUNDREDTH: number = 100;
const SECONDS_TO_MINUTES: number = 60;

@Component({
    selector: "app-choose-track",
    templateUrl: "./choose-track.component.html",
    styleUrls: ["./choose-track.component.css"]
})
export class ChooseTrackComponent implements OnInit, AfterViewInit {

    @ViewChild("preview")
    private _containerRef: ElementRef;

    private _previewCamera: PreviewCamera;
    private _previewScene: PreviewScene;

    public tracks: Track[];

    public constructor(
        private _trackService: TrackService,
        private _renderService: RenderService) {
        this.tracks = [];
    }

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
            this._previewScene.update();
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

    public getFormatedTime(score: number): string {
        const time: string[] = ["00", "00", "00"];
        const minutes: number = Math.floor(score / SECONDS_TO_MINUTES);
        const seconds: number = Math.floor(score - minutes * SECONDS_TO_MINUTES);
        const hundredth: number = Math.round((score - minutes * SECONDS_TO_MINUTES - seconds) * SECONDS_TO_HUNDREDTH);
        const minutesString: string = minutes.toString();
        const secondsString: string = seconds.toString();
        const hundredthString: string = hundredth.toString();
        time[0] = (time[0] + minutesString).substring(minutesString.length);
        time[1] = (time[1] + secondsString).substring(secondsString.length);
        time[2] = (time[2] + hundredthString).substring(hundredthString.length);

        return time.join(" : ");
    }

}
