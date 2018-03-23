import { Component, OnInit } from "@angular/core";
import { TrackStructure } from "../../../../../common/racing/track";
import { TrackService } from "../track-service/track.service";
import { Track } from "../track";

@Component({
    selector: "app-admin",
    templateUrl: "./admin.component.html",
    styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {

    public tracks: Track[];

    public constructor(private _trackService: TrackService) {
        this.tracks = [];
    }

    public ngOnInit(): void {
        this.getTracksFromServer();
    }

    private getTracksFromServer(): void {
        this._trackService.getTrackList()
            .subscribe(
            (tracksFromServer: string) => {
                this.tracks = [];
                JSON.parse(tracksFromServer).forEach((document: string) => {
                    const iTrack: TrackStructure = JSON.parse(JSON.stringify(document));
                    this.tracks.push(new Track(iTrack));
                });
            },
            (error: Error) => console.error(error)
            );
    }

    public newTrack(trackName: string): void {
        this._trackService.newTrack(trackName)
            .subscribe(
            (trackFromServer: string) => {
                const iTrack: TrackStructure = JSON.parse(JSON.stringify(trackFromServer));
                this.tracks.push(new Track(iTrack));
            },
            (error: Error) => console.error(error)
            );
    }

    public deleteTrack(id: string): void {
        this._trackService.deleteTrack(id)
            .subscribe(
            (tracksFromServer: string) => {
                this.tracks = [];
                JSON.parse(tracksFromServer).forEach((document: string) => {
                    const iTrack: TrackStructure = JSON.parse(JSON.stringify(document));
                    this.tracks.push(new Track(iTrack));
                });
            },
            (error: Error) => console.error(error)
            );
    }
}
