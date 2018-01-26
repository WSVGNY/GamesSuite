import { HostListener } from "@angular/core";
import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

import { Track } from "../../../../../common/racing/track";
import { TrackService } from "../track-service/track.service";
import { EditorRenderService } from "../editor-render-service/editor-render.service";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.css"]
})
export class EditorComponent implements OnInit {
  @Input() public track: Track;

  public constructor(
    private route: ActivatedRoute,
    private trackService: TrackService,
    private location: Location,
    private editorRenderService: EditorRenderService
  ) { }

  public ngOnInit(): void {
    this.getPiste();
  }

  public getPiste(): void {
    const id: number = +this.route.snapshot.paramMap.get("id");
    this.trackService.getPisteParID(id)
      .subscribe((track) => this.track = track);
  }

  public goBack(): void {
    this.location.back();
  }

  @HostListener("window:mousedown", ["$event"])
    public onMouseDown(event: MouseEvent): void {
        this.editorRenderService.handleMouseDown(event);
    }
}
