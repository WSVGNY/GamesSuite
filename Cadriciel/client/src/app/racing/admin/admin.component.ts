import { Component, OnInit } from "@angular/core";
import { Track, ITrack, TrackMapElement } from "../../../../../common/racing/track";
import { TrackService } from "../track-service/track.service";

@Component({
    selector: "app-admin",
    templateUrl: "./admin.component.html",
    styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {

    private tracks: TrackMapElement[] = new Array();

    public constructor(private trackService: TrackService) { }

    public ngOnInit(): void {
        this.getTracksFromServer();
    }

    private getTracksFromServer(): void {
        this.trackService.getTrackList()
            .subscribe((tracksFromServer: string) => {
                this.tracks = [];
                JSON.parse(tracksFromServer).forEach((document: string) => {
                    const iTrack: ITrack = JSON.parse(JSON.stringify(document));
                    this.tracks.push({
                        "key": iTrack._id,
                        "value": new Track(iTrack)
                    });
                });
            });
    }

    public newTrack(trackName: string): void {
        this.trackService.newTrack(trackName)
            .subscribe((tracksFromServer: string) => {
                this.tracks = [];
                JSON.parse(tracksFromServer).forEach((document: string) => {
                    const iTrack: ITrack = JSON.parse(JSON.stringify(document));
                    this.tracks.push({
                        "key": iTrack._id,
                        "value": new Track(iTrack)
                    });
                });
            });
    }

    public deleteTrack(id: string): void {
        this.trackService.deleteTrack(id)
            .subscribe((tracksFromServer: string) => {
                this.tracks = [];
                JSON.parse(tracksFromServer).forEach((document: string) => {
                    const iTrack: ITrack = JSON.parse(JSON.stringify(document));
                    this.tracks.push({
                        "key": iTrack._id,
                        "value": new Track(iTrack)
                    });
                });
            });
    }
}
