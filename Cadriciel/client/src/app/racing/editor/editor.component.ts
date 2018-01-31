import { Component, AfterViewInit, Input, HostListener, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

import { Track } from "../../../../../common/racing/track";
import { PistesService } from "../track-service/track.service";
import { EditorRenderService } from "../editor-render-service/editor-render.service";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.css"]
})
export class EditorComponent implements AfterViewInit {

  @ViewChild("containerEditor")
    private containerRef: ElementRef;

  @Input() public piste: Track;

  public constructor(
    private route: ActivatedRoute,
    private pistesService: PistesService,
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
    this.pistesService.getPisteParID(id)
      .subscribe((piste) => this.piste = piste);
  }

  public goBack(): void {
    this.location.back();
  }

  @HostListener("window:mousedown", ["$event"])
    public onMouseDown(event: MouseEvent): void {
        this.editorRenderService.handleMouseDown(event);
    }

  @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.editorRenderService.onResize();
    }

  @HostListener("window:onRightClick", ["$event"])
    public onRightClic(event: MouseEvent): void {
        this.editorRenderService.pressRightClic(event);
    }
}
