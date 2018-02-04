import { Component, AfterViewInit, Input, HostListener, ElementRef, ViewChild } from "@angular/core";
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
export class EditorComponent implements AfterViewInit {

  @ViewChild("containerEditor")
    private containerRef: ElementRef;

  @Input() public track: Track;

  public constructor(
    private route: ActivatedRoute,
    private trackService: TrackService,
    private location: Location,
    private editorRenderService: EditorRenderService
  ) { }

  public ngAfterViewInit(): void {
    this.getPiste();

    this.editorRenderService
        .initialize(this.containerRef.nativeElement)
        .then(/* do nothing */)
        .catch((err) => console.error(err));
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
        this.editorRenderService.handleMouseDown(event.which, event.x, event.y);
    }

  @HostListener("window:mousemove", ["$event"])
    public onMouseMove(event: MouseEvent): void {
        this.editorRenderService.handleMouseMove(event.x, event.y);
    }

  @HostListener("window:mouseup", ["$event"])
    public onMouseUp(event: MouseEvent): void {
        this.editorRenderService.handleMouseUp(event.x, event.y);
    }

  @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.editorRenderService.onResize();
    }

  @HostListener("window:contextmenu", ["$event"])
    public onContextMenu(event: MouseEvent): void {
        this.editorRenderService.onContextMenu(event);
    }

}
