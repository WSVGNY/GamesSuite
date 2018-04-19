import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnInit } from "@angular/core";
import { Track } from "../../../../../common/racing/track";
import { ActivatedRoute } from "@angular/router";
import { RenderService } from "../render-service/render.service";
import { TrackService } from "../track/track-service/track.service";
import { RacingGame } from "./racingGame";
import { CameraManagerService } from "../cameras/camera-manager.service";
import { StateFactoryService } from "../game-states/state-factory/state-factory.service";
import { ServiceLoaderService } from "../service-loader/service-loader.service";
import { KeyboardEventService } from "../user-input-services/keyboard-event.service";
import { SoundService } from "../sound-service/sound.service";

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
    private _stopUpdate: boolean;

    public constructor(
        private _renderService: RenderService,
        private _route: ActivatedRoute,
        private _keyBoardHandler: KeyboardEventService,
        private _trackService: TrackService,
        private _cameraManager: CameraManagerService,
        private _stateFactory: StateFactoryService,
        private _soundManager: SoundService,
        private _serviceLoader: ServiceLoaderService
    ) { }

    public ngOnInit(): void {
        this._keyBoardHandler.initialize();
    }

    public async ngAfterViewInit(): Promise<void> {
        this._cameraManager.initialize(this.computeAspectRatio());
        this._renderService
            .initialize(this._containerRef.nativeElement)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
        this._racingGame = new RacingGame(this._keyBoardHandler, this._stateFactory);
        this.getTrack();
    }

    public getTrack(): void {
        this._trackService.getTrackFromId(this._route.snapshot.paramMap.get("id"))
            .subscribe((trackFromServer: Track) => {
                this._racingGame.initializeGameFromTrack(
                    Track.createFromJSON(JSON.stringify(trackFromServer)),
                    this._cameraManager.thirdPersonCamera
                ).then(() => {
                    this.startGameLoop().then().catch();
                }).catch((err) => console.error(err));
            });
    }

    private async startGameLoop(): Promise<void> {
        await this._serviceLoader.initializeServices(this._racingGame);
        this._racingGame.startGame();
        this._stopUpdate = false;
        this.update();
    }

    private update(): void {
        requestAnimationFrame(() => {
            this._racingGame.update();
            this._renderService.render(this._racingGame.gameScene, this._cameraManager.currentCamera);
            !this._stopUpdate ? this.update() : this._racingGame = undefined;
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

    @HostListener("window:popstate", ["$event"])
    public onPopState(): void {
        this._soundManager.stopAllSounds();
        this._stopUpdate = true;
    }
}
