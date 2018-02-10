import { Component, OnInit } from "@angular/core";
import { Track } from "../../../../../common/racing/track";
import { TrackService } from "../track-service/track.service";

@Component({
    selector: "app-admin",
    templateUrl: "./admin.component.html",
    styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {

    private tracks: Track[];

    public constructor(private trackService: TrackService) { }

    public ngOnInit(): void {
        this.getTracksFromServer();
    }

    private getTracksFromServer(): void {
        this.trackService.getTrackList()
            .subscribe((tracks: Track[]) => {
                console.log(tracks[0]["_id"] + " " + tracks[0]["name"]);
                this.tracks = tracks;
            });
    }

    public newTrack(trackName: string): void {
        this.trackService.newTrack(trackName)
            .subscribe((tracks: Track[]) => this.tracks = tracks);
    }

    public deleteTrack(id: string): void {
        this.trackService.deleteTrack(id)
            .subscribe((tracks: Track[]) => this.tracks = tracks);
    }
}
