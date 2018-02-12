import { Component, OnInit } from "@angular/core";
import { TrackMap } from "../../../../../common/racing/track";
import { TrackService } from "../track-service/track.service";

@Component({
    selector: "app-admin",
    templateUrl: "./admin.component.html",
    styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {

    private tracks: TrackMap = new Array();

    public constructor(private trackService: TrackService) { }

    public ngOnInit(): void {
        this.getTracksFromServer();
    }

    private getTracksFromServer(): void {
        this.trackService.getTrackList()
            .subscribe((tracks: TrackMap) => this.tracks = tracks);
    }

    public newTrack(trackName: string): void {
        this.trackService.newTrack(trackName)
            .subscribe((tracks: TrackMap) => this.tracks = tracks);
    }

    public deleteTrack(id: string): void {
        this.trackService.deleteTrack(id)
            .subscribe((tracks: TrackMap) => this.tracks = tracks);
    }
}
