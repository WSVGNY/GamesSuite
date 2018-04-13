import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnInit } from "@angular/core";
import { Car } from "../car/car";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { Track } from "../../../../../common/racing/track";
import { ActivatedRoute } from "@angular/router";
import { GameScene } from "../scenes/gameScene";
import { AICarService } from "../artificial-intelligence/ai-car.service";
import { RenderService } from "../render-service/render.service";
import { AIDebug } from "../artificial-intelligence/ai-debug";
import { SoundManagerService } from "../sound-service/sound-manager.service";
import { TrackType } from "../../../../../common/racing/trackType";
import { CollisionManagerService } from "../collision-manager/collision-manager.service";
import { CameraManagerService } from "../cameras/camera-manager.service";
import { Vector3 } from "three";
import { CarTrackingManagerService } from "../carTracking-manager/car-tracking-manager.service";
import { TrackService } from "../track/track-service/track.service";
import { EndGameTableService } from "../scoreboard/end-game-table/end-game-table.service";
import { HighscoreService } from "../scoreboard/best-times/highscore.service";
import { Personality } from "../artificial-intelligence/ai-config";
import { Player } from "./player";
import { MINIMUM_CAR_DISTANCE, NUMBER_OF_LAPS } from "../constants/car.constants";
import { AI_CARS_QUANTITY, AI_PERSONALITY_QUANTITY } from "../constants/ai.constants";
import { CURRENT_PLAYER, COMPUTER_PLAYER } from "../constants/global.constants";

enum State {
    START_ANIMATION = 1,
    COUNTDOWN,
    RACING,
    END,
}

const ONE_SECOND: number = 1000;
const MS_TO_SEC: number = 0.001;
const AVERAGE_CAR_SPEED: number = 45;

@Component({
    moduleId: module.id,
    selector: "app-racing-component",
    templateUrl: "./racing.component.html",
    styleUrls: ["./racing.component.css"]
})

export class RacingComponent implements AfterViewInit, OnInit {

    @ViewChild("container")
    private _containerRef: ElementRef;
    private _chosenTrack: Track;
    private _cars: Car[];
    private _players: Player[];
    private _playerCar: Car;
    private _carDebugs: AIDebug[];
    private _gameScene: GameScene;
    private _lastDate: number;
    private _startDate: number;
    protected _countDownOnScreenValue: string;
    protected _isCountDownOver: boolean;
    private _currentState: State;
    private _uploadTrack: boolean = true;

    public constructor(
        private _renderService: RenderService,
        private _route: ActivatedRoute,
        private _keyBoardHandler: KeyboardEventHandlerService,
        private _trackService: TrackService,
        private _aiCarService: AICarService,
        private _collisionManagerService: CollisionManagerService,
        private _soundManager: SoundManagerService,
        private _cameraManager: CameraManagerService,
        private _trackingManager: CarTrackingManagerService,
        private _endGameTableService: EndGameTableService,
        private _highscoreService: HighscoreService
    ) {
        this._cars = [];
        this._players = [];
        this._carDebugs = [];
        this._isCountDownOver = false;
        this._currentState = State.START_ANIMATION;
    }

    public ngOnInit(): void {
        this._gameScene = new GameScene(this._keyBoardHandler/*, this._collisionManagerService*/);
    }

    public async ngAfterViewInit(): Promise<void> {
        this._cameraManager.initializeCameras(this.computeAspectRatio());
        this._renderService
            .initialize(this._containerRef.nativeElement, this._gameScene, this._cameraManager.currentCamera)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
        this._keyBoardHandler.initialize();
        this.getTrack();
    }

    private computeAspectRatio(): number {
        return this._containerRef.nativeElement.clientWidth / this._containerRef.nativeElement.clientHeight;
    }

    public startGameLoop(): void {
        this._lastDate = Date.now();
        this._lastDate = Date.now();
        this._startDate = Date.now();
        this._countDownOnScreenValue = "";
        this._cameraManager.changeToSpectatingCamera();
        this._gameScene.createStartingLine();
        this.update();
    }

    private updateStartingAnimation(elapsedTime: number): void {
        this._cameraManager.updateCameraPositions(this._playerCar, elapsedTime);
        if (this._cameraManager.currentCamera.position.clone().distanceTo(this._playerCar.currentPosition) < MINIMUM_CAR_DISTANCE) {
            this._startDate = Date.now();
            this._countDownOnScreenValue = "3";
            this._currentState = State.COUNTDOWN;
            this._cameraManager.changeToThirdPersonCamera();
            this._soundManager.playCurrentStartSequenceSound();
        }
    }

    private updateCountdown(): void {
        let i: number = +this._countDownOnScreenValue;
        this._countDownOnScreenValue = (--i).toString();
        if (i === 0) {
            this._countDownOnScreenValue = "START";
            this._isCountDownOver = true;
            this._startDate = Date.now();
            this._lastDate = Date.now();
            this._currentState = State.RACING;
        }
    }

    private updateRacing(timeSinceLastFrame: number): void {
        this.updateCars(timeSinceLastFrame);
        this._collisionManagerService.update(this._cars);
        this._cameraManager.updateCameraPositions(this._playerCar);
    }

    private updateCars(timeSinceLastFrame: number): void {
        for (let i: number = 0; i < AI_CARS_QUANTITY + 1; ++i) {
            this._cars[i].update(timeSinceLastFrame);
            const donePlayer: Player = this._players.find((player: Player) => player.id === this._cars[i].uniqueid);
            if (this._cars[i].isAI) {
                this._aiCarService.update(this._cars[i], this._carDebugs[i]);
                if (this._trackingManager.update(this._cars[i].currentPosition, this._cars[i].raceProgressTracker)) {
                    donePlayer.position = this.findPosition(donePlayer);
                    donePlayer.setTotalTime((Date.now() - this._startDate) * MS_TO_SEC);
                    this._cars[i].raceProgressTracker.isTimeLogged = true;
                }
            } else {
                if (this._trackingManager.update(this._cars[i].currentPosition, this._cars[i].raceProgressTracker)) {
                    donePlayer.position = this.findPosition(donePlayer);
                    donePlayer.setTotalTime((Date.now() - this._startDate) * MS_TO_SEC);
                    this._cars[i].raceProgressTracker.isTimeLogged = true;
                    this._currentState = State.END;
                }
            }
        }
    }

    private findPosition(donePlayer: Player): number {
        let position: number = 1;
        for (const player of this._players) {
            if (player.position !== undefined) {
                position++;
            }
        }

        return position;
    }

    private endGame(elapsedTime: number): void {
        for (const car of this._cars) {
            if (!car.raceProgressTracker.isRaceCompleted && !car.raceProgressTracker.isTimeLogged) {
                const donePlayer: Player = this._players.find((player: Player) => player.id === car.uniqueid);
                donePlayer.position = this.findPosition(donePlayer);
                donePlayer.setTotalTime(
                    this.simulateRaceTime(
                        car.raceProgressTracker.currentSegmentIndex,
                        car.raceProgressTracker.segmentCounted,
                        car.currentPosition
                    ) + elapsedTime
                );
                car.raceProgressTracker.isTimeLogged = true;
            }
        }
    }

    private simulateRaceTime(currentSegmentIndex: number, segmentCounted: number, position: Vector3): number {
        const lapSegmentAmount: number = this._chosenTrack.vertices.length;
        const totalSegmentAmount: number = lapSegmentAmount * NUMBER_OF_LAPS;
        const segmentsToGo: number = totalSegmentAmount - segmentCounted;
        const completeLapsToGo: number = Math.floor(segmentsToGo / lapSegmentAmount);

        return this.simulateCompleteLapTime(completeLapsToGo) +
            this.simulatePartialLapTime(currentSegmentIndex) +
            this.simulatePartialSegmentTime(currentSegmentIndex, position);

    }

    private simulateCompleteLapTime(lapAmount: number): number {
        let simulatedTime: number = 0;
        for (let i: number = 0; i < this._chosenTrack.vertices.length; ++i) {
            if ((i + 1) !== this._chosenTrack.vertices.length) {
                const currentVertice: Vector3 = new Vector3(this._chosenTrack.vertices[i].x, 0, this._chosenTrack.vertices[i].z);
                const nextVertice: Vector3 = new Vector3(this._chosenTrack.vertices[i + 1].x, 0, this._chosenTrack.vertices[i + 1].z);
                simulatedTime += (currentVertice.distanceTo(nextVertice) / AVERAGE_CAR_SPEED);
            }
        }

        return simulatedTime * lapAmount;
    }

    private simulatePartialLapTime(currentSegmentIndex: number): number {
        let simulatedTime: number = 0;
        if (currentSegmentIndex !== 0) {
            for (let i: number = currentSegmentIndex; i < this._chosenTrack.vertices.length; ++i) {
                if ((i + 1) !== this._chosenTrack.vertices.length) {
                    const currentVertice: Vector3 = new Vector3(this._chosenTrack.vertices[i].x, 0, this._chosenTrack.vertices[i].z);
                    const nextVertice: Vector3 = new Vector3(this._chosenTrack.vertices[i + 1].x, 0, this._chosenTrack.vertices[i + 1].z);
                    simulatedTime += (currentVertice.distanceTo(nextVertice) / AVERAGE_CAR_SPEED);
                }
            }
        }

        return simulatedTime;
    }

    private simulatePartialSegmentTime(currentSegmentIndex: number, position: Vector3): number {
        const nextTrackVertex: Vector3 = new Vector3(
            this._chosenTrack.vertices[currentSegmentIndex].x,
            0,
            this._chosenTrack.vertices[currentSegmentIndex].z
        );

        return (position.distanceTo(nextTrackVertex) / AVERAGE_CAR_SPEED);
    }

    private updateEnd(): void {
        if (this._endGameTableService.players.length === 0) {
            this._endGameTableService.showTable = true;
            this._endGameTableService.players = this._players;
        }
        if (this._highscoreService.highscores.length === 0) {
            this._highscoreService.highscores = this._chosenTrack.bestTimes;
        }
        if (this._highscoreService.showTable && this._uploadTrack) {
            this._uploadTrack = false;
            this._chosenTrack.bestTimes = this._highscoreService.highscores;
            this._trackService.putTrack(this._chosenTrack.id, this._chosenTrack).subscribe();
        }
    }

    private update(): void {
        requestAnimationFrame(() => {
            const timeSinceLastFrame: number = Date.now() - this._lastDate;
            const elapsedTime: number = Date.now() - this._startDate;
            this._lastDate = Date.now();
            switch (this._currentState) {
                case State.START_ANIMATION:
                    this.updateStartingAnimation(elapsedTime);
                    break;
                case State.COUNTDOWN:
                    if (elapsedTime > ONE_SECOND) {
                        this._startDate += ONE_SECOND;
                        this.updateCountdown();
                        this._soundManager.playCurrentStartSequenceSound();
                    }
                    break;
                case State.RACING:
                    this.updateRacing(timeSinceLastFrame);
                    break;
                case State.END:
                    this.endGame(elapsedTime * MS_TO_SEC);
                    this.updateEnd();
                    break;
                default:
            }
            this._soundManager.setAccelerationSound(this._playerCar);
            this._renderService.render(this._gameScene, this._cameraManager.currentCamera);
            this.update();
        });
    }

    private async createSounds(): Promise<void> {
        await this._soundManager.createStartingSound(this._playerCar);
        await this._soundManager.createMusic(this._playerCar);
        await this._soundManager.createCarCollisionSound(this._playerCar);
        await this._soundManager.createAccelerationSound(this._playerCar);
        await this._soundManager.createWallCollisionSound(this._playerCar);
    }

    public getTrack(): void {
        this._trackService.getTrackFromId(this._route.snapshot.paramMap.get("id"))
            .subscribe((trackFromServer: Track) => {
                this._chosenTrack = Track.createFromJSON(JSON.stringify(trackFromServer));
                this.initializeGameFromTrack(this._chosenTrack).catch((err) => console.error(err));
            });
    }

    private async initializeGameFromTrack(track: Track): Promise<void> {
        this.initializeCars(this._chosenTrack.type);
        this._gameScene.loadTrack(this._chosenTrack);
        this._collisionManagerService.track = this._gameScene.trackMesh;
        await this.createSounds();
        await this._gameScene.loadCars(this._cars, this._carDebugs, this._cameraManager.currentCamera, this._chosenTrack.type);
        this._soundManager.accelerationSoundEffect.play();
        await this._aiCarService.initialize(this._gameScene.trackMesh.trackPoints.toVectors3, )
            .then().catch((err) => console.error(err));
        this._cameraManager.initializeSpectatingCameraPosition(this._playerCar.currentPosition, this._playerCar.direction);
        this._trackingManager.init(this._gameScene.trackMesh.trackPoints.toVectors3);
        this.bindKeys();
        this.startGameLoop();
    }

    private bindKeys(): void {
        this._cameraManager.bindCameraKey();
        this._soundManager.bindSoundKeys();
        this._gameScene.bindGameSceneKeys(this._cars);
    }

    private initializeCars(trackType: TrackType): void {
        for (let i: number = 0; i < AI_CARS_QUANTITY + 1; ++i) {
            if (i === 0) {
                this._cars.push(new Car(i, this._keyBoardHandler, false));
                this._playerCar = this._cars[0];
                this._players.push(new Player(i, CURRENT_PLAYER));
            } else if (i - 1 % AI_PERSONALITY_QUANTITY === 0) {
                this._cars.push(new Car(i, this._keyBoardHandler, true, Personality.Larry));
                this._players.push(new Player(i, COMPUTER_PLAYER + (i + 1)));
            } else if (i - 1 % AI_PERSONALITY_QUANTITY === 1) {
                this._cars.push(new Car(i, this._keyBoardHandler, true, Personality.Curly));
                this._players.push(new Player(i, COMPUTER_PLAYER + (i + 1)));
            } else if (i - 1 % AI_PERSONALITY_QUANTITY === 2) {
                this._cars.push(new Car(i, this._keyBoardHandler, true, Personality.Moe));
                this._players.push(new Player(i, COMPUTER_PLAYER + (i + 1)));
            }
            this._carDebugs.push(new AIDebug());
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
        if (this._gameScene !== undefined && this._isCountDownOver) {
            this._keyBoardHandler.handleKeyDown(event.keyCode);
        }
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        if (this._gameScene !== undefined && this._isCountDownOver) {
            this._keyBoardHandler.handleKeyUp(event.keyCode);
        }
    }
}
