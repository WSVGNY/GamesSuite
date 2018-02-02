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
        this.getPistes();
    }

    public getPistes(): void {
        this.trackService.getListePiste()
            .subscribe((tracks) => this.tracks = tracks);
    }
}
