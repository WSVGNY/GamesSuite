import { Component, AfterViewInit, HostListener, ElementRef, ViewChild, OnInit, Input } from "@angular/core";
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

export class EditorComponent implements AfterViewInit, OnInit {

    @ViewChild("containerEditor")
    private containerRef: ElementRef;
    @Input()
    private currentTrackName: string = "New Track";
    private trackChosenFromAdmin: Track;

    public constructor(
        private route: ActivatedRoute,
        private trackService: TrackService,
        private location: Location,
        private editorRenderService: EditorRenderService
    ) { }

    public async ngOnInit(): Promise<void> {
        await this.getTrack();
    }

    public ngAfterViewInit(): void {
        this.editorRenderService
            .initialize(this.containerRef.nativeElement)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
    }

    public getTrack(): void {
        const id: number = +this.route.snapshot.paramMap.get("id");
        this.trackService.getTrackFromId(id)
            .subscribe((track: Track) => {
                this.trackChosenFromAdmin = new Track(track["id"], track["name"]);
                this.currentTrackName = this.trackChosenFromAdmin.$name;
            });
    }

    public saveTrack(): void {
        this.trackChosenFromAdmin.$name = this.currentTrackName;
        this.trackService.putTrack(this.trackChosenFromAdmin)
            .subscribe((track: Track) => {
                this.trackChosenFromAdmin = new Track(track["id"], track["name"]);
            });
    }

    public saveTrackName(trackName: string): void {
        this.currentTrackName = trackName;
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
