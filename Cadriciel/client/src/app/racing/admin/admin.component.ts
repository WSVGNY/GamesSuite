import { Component, OnInit } from "@angular/core";
import { Track } from "../../../../../common/racing/track";
import { TrackService } from "../track-service/track.service";

@Component({
    selector: "app-admin",
    templateUrl: "./admin.component.html",
    styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {

    public tracks: Track[];

    public constructor(private trackService: TrackService) { }

    public ngOnInit(): void {
        this.getTrackFromId();
    }

    public getTrackFromId(): void {
        this.trackService.getTrackList()
            .subscribe((tracks: Track[]) => this.tracks = tracks);
    }

    public newTrack(): void {
        this.trackService.newTrack("New track")
            .subscribe((track: Track) => this.tracks.push(track));
    }

    public deleteTrack(id: number): void {
        this.trackService.deleteTrack(id)
            .subscribe((tracks: Track[]) => this.tracks = tracks);
    }
}
