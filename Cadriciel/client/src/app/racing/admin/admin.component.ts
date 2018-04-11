import { Component, OnInit } from "@angular/core";
import { Track } from "../../../../../common/racing/track";
import { TrackService } from "../track/track-service/track.service";

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
                (tracksFromServer: Track[]) => {
                    this.tracks = [];
                    tracksFromServer.forEach((document: Track) => {
                        this.tracks.push(Track.createFromJSON(JSON.stringify(document)));
                    });
                },
                (error: Error) => console.error(error)
            );
    }

    public newTrack(trackName: string): void {
        this._trackService.newTrack(trackName)
            .subscribe(
                (trackFromServer: Track) => {
                    this.tracks.push(Track.createFromJSON(JSON.stringify(trackFromServer)));
                },
                (error: Error) => console.error(error)
            );
    }

    public deleteTrack(id: string): void {
        this._trackService.deleteTrack(id)
            .subscribe(
                (tracksFromServer: Track[]) => {
                    this.tracks = [];
                    tracksFromServer.forEach((document: Track) => {
                        this.tracks.push(Track.createFromJSON(JSON.stringify(document)));
                    });
                },
                (error: Error) => console.error(error)
            );
    }
}
