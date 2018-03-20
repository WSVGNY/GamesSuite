import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnInit } from "@angular/core";
import { Car } from "./car/car";
import { KeyboardEventHandlerService } from "./event-handlers/keyboard-event-handler.service";
import { TrackStructure } from "../../../../common/racing/track";
import { TrackService } from "./track-service/track.service";
import { ActivatedRoute } from "@angular/router";
import { Track } from "./track";
import { ThirdPersonCamera } from "./cameras/thirdPersonCamera";
import { GameScene } from "./scenes/gameScene";
import { AICarService } from "./artificial-intelligence/ai-car.service";
import { Difficulty } from "../../../../common/crossword/difficulty";
import { TrackPointList } from "./render-service/trackPointList";
import { RenderService } from "./render-service/render.service";
import { AIDebug } from "./artificial-intelligence/ai-debug";
import { TopViewCamera } from "./cameras/topViewCamera";
import { CHANGE_CAMERA_KEYCODE, DAY_KEYCODE, DEBUG_KEYCODE } from "./constants";
// import { SoundManagerService } from "./sound-service/sound-manager.service";

const AI_CARS_QUANTITY: number = 2;

@Component({
    moduleId: module.id,
    selector: "app-racing-component",
    templateUrl: "./racing.component.html",
    styleUrls: ["./racing.component.css"]
})

export class RacingComponent implements AfterViewInit, OnInit {

    @ViewChild("container")
    private _containerRef: ElementRef;
    private _currentTrackId: string = "";
    private _chosenTrack: Track;
    private _cars: Car[] = [];
    private _carDebugs: AIDebug[] = [];
    private _thirdPersonCamera: ThirdPersonCamera;
    private _topViewCamera: TopViewCamera;
    private _useThirpPersonCamera: boolean = true;
    private _gameScene: GameScene;
    private _playerCar: Car;
    private _lastDate: number;
    private _trackPoints: TrackPointList;

    public constructor(
        private _renderService: RenderService,
        private _route: ActivatedRoute,
        private _keyboardEventHandlerService: KeyboardEventHandlerService,
        private _trackService: TrackService,
        private _aiCarService: AICarService,
        // private _soundManagerService: SoundManagerService
    ) { }

    public ngOnInit(): void {
        this._gameScene = new GameScene(this._keyboardEventHandlerService);
    }

    public async ngAfterViewInit(): Promise<void> {
        this._thirdPersonCamera = new ThirdPersonCamera(this.computeAspectRatio());
        this._topViewCamera = new TopViewCamera(this.computeAspectRatio());
        this._renderService
            .initialize(this._containerRef.nativeElement, this._gameScene, this._thirdPersonCamera)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
        this._keyboardEventHandlerService.initialize();
        this.getTrack();
    }

    private computeAspectRatio(): number {
        return this._containerRef.nativeElement.clientWidth / this._containerRef.nativeElement.clientHeight;
    }

    public startGameLoop(): void {
        // this._soundManagerService.createSound("../../../assets/sounds/rainbowRoad.mp3", this._thirdPersonCamera, this._playerCar);
        this._lastDate = Date.now();
        this.update();
    }

    private update(): void {
        requestAnimationFrame(() => {
            const timeSinceLastFrame: number = Date.now() - this._lastDate;
            this._lastDate = Date.now();
            for (let i: number = 0; i < AI_CARS_QUANTITY + 1; ++i) {
                this._cars[i].update(timeSinceLastFrame);
                if (this._cars[i].isAI) {
                    this._aiCarService.update(this._cars[i], this._carDebugs[i]);
                }
            }
            this._useThirpPersonCamera ?
                this._renderService.render(this._gameScene, this._thirdPersonCamera) :
                this._renderService.render(this._gameScene, this._topViewCamera);
            this._topViewCamera.updatePosition(this._playerCar);
            this.update();
        });
    }

    public getTrack(): void {
        this._currentTrackId = this._route.snapshot.paramMap.get("id");
        this._trackService.getTrackFromId(this._currentTrackId)
            .subscribe(async (trackFromServer: string) => {
                const iTrack: TrackStructure = JSON.parse(JSON.stringify(trackFromServer));
                this._chosenTrack = new Track(iTrack);
                this._trackPoints = new TrackPointList(this._chosenTrack.vertices);

                this.initializeCars();
                await this._gameScene.loadTrack(this._chosenTrack);
                await this._gameScene.loadCars(this._cars, this._carDebugs, this._thirdPersonCamera);
                await this._aiCarService
                    .initialize(this._trackPoints.pointVectors, Difficulty.Medium)
                    .then(/* do nothing */)
                    .catch((err) => console.error(err));
                this.bindKeys();
                this.startGameLoop();
                // this.initializeGame().then().catch((error: Error) => console.error(error));
            });
    }

    private bindKeys(): void {
        this._keyboardEventHandlerService.bindFunctionToKeyDown(DAY_KEYCODE, () => this._gameScene.changeTimeOfDay(this._cars));
        this._keyboardEventHandlerService.bindFunctionToKeyDown(DEBUG_KEYCODE, () => this._gameScene.changeDebugMode());
        this._keyboardEventHandlerService.bindFunctionToKeyDown(CHANGE_CAMERA_KEYCODE, () =>
            this._useThirpPersonCamera = !this._useThirpPersonCamera
        );
    }

    private initializeCars(): void {
        for (let i: number = 0; i < AI_CARS_QUANTITY + 1; ++i) {

            if (i === 0) {
                this._cars.push(new Car(this._keyboardEventHandlerService, false));
                this._playerCar = this._cars[0];
            } else {
                this._cars.push(new Car(this._keyboardEventHandlerService, true));
            }
            this._carDebugs.push(new AIDebug());
            // this.isEven(i) ? Difficulty.Hard : Difficulty.Easy;
        }
    }

    public get car(): Car {
        return this._playerCar;
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this._renderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        if (this._gameScene !== undefined) {
            this._keyboardEventHandlerService.handleKeyDown(event.keyCode);
        }
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        if (this._gameScene !== undefined) {
            this._keyboardEventHandlerService.handleKeyUp(event.keyCode);
        }
    }

}
