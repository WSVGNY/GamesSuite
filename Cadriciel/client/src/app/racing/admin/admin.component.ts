import { Component, OnInit } from "@angular/core";
import { Track } from "../../../../../common/racing/track";
import { PistesService } from "../track-service/track.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {

  public pistes: Track[];

  public constructor(private pisteService: PistesService) { }

  public ngOnInit(): void {
    this.getPistes();
  }

  public getPistes(): void {
    this.pisteService.getListePiste()
    .subscribe((pistes) => this.pistes = pistes);
  }
}
