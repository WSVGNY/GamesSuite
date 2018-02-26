import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { RenderService } from "./render-service/render.service";
import { Car } from "./car/car";
import { KeyboardEventHandlerService } from "./event-handlers/keyboard-event-handler.service";
import { TrackStructure } from "../../../../common/racing/track";
import { TrackService } from "./track-service/track.service";
import { ActivatedRoute } from "@angular/router";
import { RaceGame } from "./game-loop/raceGame";
import { Track } from "./track";

@Component({
    moduleId: module.id,
    selector: "app-racing-component",
    templateUrl: "./racing.component.html",
    styleUrls: ["./racing.component.css"]
})

export class RacingComponent implements AfterViewInit {

    @ViewChild("container")
    private _containerRef: ElementRef;
    private _currentTrackId: string = "";
    private _chosenTrack: Track;
    private _raceGame: RaceGame;

    public constructor(
        private renderService: RenderService,
        private route: ActivatedRoute,
        private keyboardEventHandlerService: KeyboardEventHandlerService,
        private trackService: TrackService
    ) { }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        if (this._raceGame !== undefined) {
            this.keyboardEventHandlerService.handleKeyDown(event, this._raceGame);
        }
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        if (this._raceGame !== undefined) {
            this.keyboardEventHandlerService.handleKeyUp(event, this._raceGame);
        }
    }

    public async ngAfterViewInit(): Promise<void> {
        this.getTrack();

        this.keyboardEventHandlerService
            .initialize()
            .then(/* do nothing */)
            .catch((err) => console.error(err));
    }

    public getTrack(): void {
        this._currentTrackId = this.route.snapshot.paramMap.get("id");
        this.trackService.getTrackFromId(this._currentTrackId)
            .subscribe((trackFromServer: string) => {
                const iTrack: TrackStructure = JSON.parse(JSON.stringify(trackFromServer));
                this._chosenTrack = new Track(iTrack);
                this.initializeGame();
            });
    }

    private async initializeGame(): Promise<void> {
        this._raceGame = new RaceGame(this.renderService);
        await this._raceGame.initialize(this._chosenTrack.toTrackStructure(), this._containerRef);
    }

    public get car(): Car {
        return this._raceGame.playerCar;
    }

}
