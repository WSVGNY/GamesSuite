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
    public message: string = "";

    public constructor(private trackService: TrackService) { }

    public ngOnInit(): void {
        this.getTrackFromId();
    }

    public getTrackFromId(): void {
        this.trackService.getTrackList()
            .subscribe((tracks) => this.tracks = tracks);
    }

    public newTrack(): void {
        this.message += "new ";
        this.trackService.newTrack("New track")
            .subscribe((track: Track) => this.tracks.push(track));
    }

    public deleteTrack(id: number): void {
        this.message += "delete " + id + " ";
        this.trackService.deleteTrack(id)
            .subscribe((success: boolean) =>
                this.tracks.splice(this.tracks.findIndex((track: Track) => track.$id === id), 1));
    }
}
