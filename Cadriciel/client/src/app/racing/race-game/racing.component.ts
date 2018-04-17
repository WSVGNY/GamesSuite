import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnInit } from "@angular/core";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { Track } from "../../../../../common/racing/track";
import { ActivatedRoute } from "@angular/router";
import { RenderService } from "../render-service/render.service";
import { TrackService } from "../track/track-service/track.service";
// import { EndGameTableService } from "../scoreboard/end-game-table/end-game-table.service";
// import { HighscoreService } from "../scoreboard/best-times/highscore.service";
import { RacingGame } from "./racingGame";
// import { GameUpdateManagerService } from "../game-update-manager/game-update-manager.service";
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
    // private _uploadTrack: boolean = true;
    private _racingGame: RacingGame;

    public _countDownOnScreenValue: string;
    public _isCountdownOver: boolean;

    public constructor(
        private _renderService: RenderService,
        private _route: ActivatedRoute,
        private _keyBoardHandler: KeyboardEventHandlerService,
        private _trackService: TrackService,
        // private _gameUpdateManager: GameUpdateManagerService,
        private _cameraManager: CameraManagerService,
        private _stateFactory: StateFactoryService
        // private _endGameTableService: EndGameTableService,
        // private _highscoreService: HighscoreService,
    ) { }

    public ngOnInit(): void {
        this._keyBoardHandler.initialize();
        // this._gameScene = new GameScene(this._keyBoardHandler/*, this._collisionManagerService*/);
    }

    public async ngAfterViewInit(): Promise<void> {
        this._cameraManager.initializeCameras(this.computeAspectRatio());
        // this._gameUpdateManager.initialize();
        this._renderService
            .initialize(this._containerRef.nativeElement)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
        this._keyBoardHandler.initialize();
        this._racingGame = new RacingGame(this._keyBoardHandler, this._stateFactory);
        this.getTrack();
        // console.log(this._racingGame.gameScene.trackMesh);
        // this.startGameLoop();
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

    private startGameLoop(): void {
        this._countDownOnScreenValue = "";
        this.update();
    }

    private update(): void {
        requestAnimationFrame(() => {
            // this._gameUpdateManager.update(this._racingGame);
            this._racingGame.update();
            this._renderService.render(this._racingGame.gameScene, this._cameraManager.currentCamera);
            this.update();
        });
    }

    private computeAspectRatio(): number {
        return this._containerRef.nativeElement.clientWidth / this._containerRef.nativeElement.clientHeight;
    }

    // private sortPlayers(): void {
    //     this._players.sort((player1: Player, player2: Player) => player1.score.totalTime - player2.score.totalTime);
    // }

    // private setPositions(): void {
    //     let position: number = 1;
    //     for (const player of this._players) {
    //         player.position = position++;
    //     }
    // }

    // private update(): void {
    //     requestAnimationFrame(() => {
    //         const timeSinceLastFrame: number = Date.now() - this._lastDate;
    //         const elapsedTime: number = Date.now() - this._startDate;
    //         this._lastDate = Date.now();
    //         switch (this._currentState) {
    //             case State.START_ANIMATION:
    //                 this.updateStartingAnimation(elapsedTime);
    //                 break;
    //             case State.COUNTDOWN:
    //                 if (elapsedTime > ONE_SECOND) {
    //                     this._startDate += ONE_SECOND;
    //                     this.updateCountdown();
    //                     this._soundManager.playCurrentStartSequenceSound();
    //                 }
    //                 break;
    //             case State.RACING:
    //                 this.updateRacing(timeSinceLastFrame);
    //                 break;
    //             case State.END:
    //                 this.endGame(elapsedTime * MS_TO_SEC);
    //                 this.updateEnd();
    //                 break;
    //             default:
    //         }
    //         this._soundManager.setAccelerationSound(this._playerCar);
    //         this._renderService.render(this._gameScene, this._cameraManager.currentCamera);
    //         this.update();
    //     });
    // }

    // private updateEnd(): void {
    //     if (this._endGameTableService.players.length === 0) {
    //         this._endGameTableService.showTable = true;
    //         this.sortPlayers();
    //         this.setPositions();
    //         this._endGameTableService.players = this._players;
    //     }
    //     if (this._highscoreService.highscores.length === 0) {
    //         this._highscoreService.highscores = this._chosenTrack.bestTimes;
    //     }
    //     if (this._highscoreService.showTable && this._uploadTrack) {
    //         this._uploadTrack = false;
    //         this._chosenTrack.bestTimes = this._highscoreService.highscores;
    //         this._trackService.putTrack(this._chosenTrack.id, this._chosenTrack).subscribe();
    //     }
    // }

    // private async createSounds(): Promise<void> {
    //     await this._soundManager.createStartingSound(this._playerCar);
    //     await this._soundManager.createMusic(this._playerCar);
    //     await this._soundManager.createCarCollisionSound(this._playerCar);
    //     await this._soundManager.createAccelerationSound(this._playerCar);
    //     await this._soundManager.createWallCollisionSound(this._playerCar);
    // }

    // public get car(): HumanCar {
    //     return this._playerCar;
    // }

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
