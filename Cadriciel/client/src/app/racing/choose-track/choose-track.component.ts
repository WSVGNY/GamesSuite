import { Component, OnInit } from "@angular/core";
import { TrackService } from "../track-service/track.service";
import { TrackMapElement, ITrack, Track } from "../../../../../common/racing/track";

@Component({
    selector: "app-choose-track",
    templateUrl: "./choose-track.component.html",
    styleUrls: ["./choose-track.component.css"]
})
export class ChooseTrackComponent implements OnInit {

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
}
