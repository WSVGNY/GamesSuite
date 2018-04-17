import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnInit } from "@angular/core";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { Track } from "../../../../../common/racing/track";
import { ActivatedRoute } from "@angular/router";
import { RenderService } from "../render-service/render.service";
import { TrackService } from "../track/track-service/track.service";
// import { EndGameTableService } from "../scoreboard/end-game-table/end-game-table.service";
// import { HighscoreService } from "../scoreboard/best-times/highscore.service";
import { RacingGame } from "./racingGame";
import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";
import { CameraManagerService } from "../cameras/camera-manager.service";
import { StateFactoryService } from "../game-states/state-factory/state-factory.service";

// const ONE_SECOND: number = 1000;
// const MS_TO_SEC: number = 0.001;
// const AVERAGE_CAR_SPEED: number = 45;

@Component({
    moduleId: module.id,
    selector: "app-racing-component",
    templateUrl: "./racing.component.html",
    styleUrls: ["./racing.component.css"]
})

export class RacingComponent implements AfterViewInit, OnInit {

    @ViewChild("container")
    private _containerRef: ElementRef;
    private _racingGame: RacingGame;

    public constructor(
        private _renderService: RenderService,
        private _route: ActivatedRoute,
        private _keyBoardHandler: KeyboardEventHandlerService,
        private _trackService: TrackService,
        private _gameUpdateManager: GameUpdateManagerService,
        private _cameraManager: CameraManagerService,
        private _stateFactory: StateFactoryService
    ) { }

    public ngOnInit(): void {
        this._keyBoardHandler.initialize();
    }

    public async ngAfterViewInit(): Promise<void> {
        this._cameraManager.initializeCameras(this.computeAspectRatio());
        this._renderService
            .initialize(this._containerRef.nativeElement)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
        this._keyBoardHandler.initialize();
        this._racingGame = new RacingGame(this._keyBoardHandler, this._stateFactory);
        this.getTrack();
    }

    public getTrack(): void {
        this._trackService.getTrackFromId(this._route.snapshot.paramMap.get("id"))
            .subscribe((trackFromServer: Track) => {
                this._racingGame
                    .initializeGameFromTrack(
                        Track.createFromJSON(JSON.stringify(trackFromServer)),
                        this._cameraManager.thirdPersonCamera
                    )
                    .then(() => { this.startGameLoop(); })
                    .catch((err) => console.error(err));
            });
    }

    private async startGameLoop(): Promise<void> {
        await this._gameUpdateManager.initializeServices(this._racingGame);
        this._racingGame.startGame();
        this.update();
    }

    private update(): void {
        requestAnimationFrame(() => {
            this._racingGame.update();
            this._renderService.render(this._racingGame.gameScene, this._cameraManager.currentCamera);
            this.update();
        });
    }

    private computeAspectRatio(): number {
        return this._containerRef.nativeElement.clientWidth / this._containerRef.nativeElement.clientHeight;
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this._renderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        if (this._racingGame !== undefined) {
            this._keyBoardHandler.handleKeyDown(event.keyCode);
        }
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        if (this._racingGame !== undefined) {
            this._keyBoardHandler.handleKeyUp(event.keyCode);
        }
    }
}
