import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnInit } from "@angular/core";
import { RenderService } from "./render-service/render.service";
import { Car } from "./car/car";
import { KeyboardEventHandlerService } from "./event-handlers/keyboard-event-handler.service";
import { Track, ITrack } from "../../../../common/racing/track";
import { TrackService } from "./track-service/track.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    moduleId: module.id,
    selector: "app-racing-component",
    templateUrl: "./racing.component.html",
    styleUrls: ["./racing.component.css"]
})

export class RacingComponent implements OnInit, AfterViewInit {

    @ViewChild("container")
    private containerRef: ElementRef;
    private currentTrackId: string = "";
    private chosenTrack: Track;

    public constructor(
        private renderService: RenderService,
        private route: ActivatedRoute,
        private keyboardEventHandlerService: KeyboardEventHandlerService,
        private trackService: TrackService
    ) { }

    public async ngOnInit(): Promise<void> {
        await this.getTrack();
    }

    public getTrack(): void {
        this.currentTrackId = this.route.snapshot.paramMap.get("id");
        this.trackService.getTrackFromId(this.currentTrackId)
            .subscribe((trackFromServer: string) => {
                const iTrack: ITrack = JSON.parse(JSON.stringify(trackFromServer));
                this.chosenTrack = new Track(iTrack);
            });
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        this.keyboardEventHandlerService.handleKeyDown(event, this.car);
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        this.keyboardEventHandlerService.handleKeyUp(event, this.car);
    }

    public ngAfterViewInit(): void {
        this.renderService
            .initialize(this.containerRef.nativeElement)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
        this.keyboardEventHandlerService
            .initialize()
            .then(/* do nothing */)
            .catch((err) => console.error(err));
    }

    public get car(): Car {
        return this.renderService.playerCar;
    }

    public hider(): void {
        document.getElementById("image1").style.display = "none";
        document.getElementById("image2").style.display = "none";
    }
}
