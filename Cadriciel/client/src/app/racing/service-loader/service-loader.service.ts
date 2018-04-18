import { Injectable } from "@angular/core";
import { RacingGame } from "../race-game/racingGame";
import { AICarService } from "../artificial-intelligence/ai-car.service";
import { CollisionManagerService } from "../collision-manager/collision-manager.service";
import { CameraManagerService } from "../cameras/camera-manager.service";
import { CarTrackingService } from "../carTracking-manager/car-tracking-manager.service";
import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";
import { CountdownService } from "../countdown/countdown.service";
import { SoundManagerService } from "../sound-service/sound-manager.service";
import { EndGameTableService } from "../scoreboard/end-game-table/end-game-table.service";
import { HighscoreService } from "../scoreboard/best-times/highscore.service";
import { InputTimeService } from "../scoreboard/input-time/input-time.service";
import { TrackService } from "../track/track-service/track.service";
import { Vector3 } from "three";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";

@Injectable()
export class ServiceLoaderService {
    public constructor(
        private _aiCarService: AICarService,
        private _collisionManager: CollisionManagerService,
        private _cameraManager: CameraManagerService,
        private _trackingManager: CarTrackingService,
        private _gameTimeManager: GameTimeManagerService,
        private _countdownService: CountdownService,
        private _soundManager: SoundManagerService,
        private _endGameTableService: EndGameTableService,
        private _highscoreService: HighscoreService,
        private _inputTimeService: InputTimeService,
        private _trackService: TrackService,
        private _keyboardEventHandler: KeyboardEventHandlerService
    ) { }

    public async initializeServices(racingGame: RacingGame): Promise<void> {
        this._aiCarService.initialize(racingGame.gameScene.trackMesh.trackPoints.toVectors3).then().catch();
        this._collisionManager.track = racingGame.gameScene.trackMesh;
        this._cameraManager.initializeSpectatingCameraPosition(racingGame.playerCar.currentPosition, racingGame.playerCar.direction);
        this._trackingManager.init(
            this.getTrackPoints(racingGame),
            this.getStartLinePosition(racingGame),
            this.getStartSegment(racingGame));
        this._gameTimeManager.initializeDates();
        await this.createSounds(racingGame);
    }

    private getTrackPoints(racingGame: RacingGame): Vector3[] {
        return racingGame.gameScene.trackMesh.trackPoints.toVectors3;
    }

    private getStartLinePosition(racingGame: RacingGame): Vector3 {
        return racingGame.gameScene.trackMesh.startLineWorldPosition;
    }

    private getStartSegment(racingGame: RacingGame): Vector3 {
        return racingGame.gameScene.trackMesh.startingSegmentDirection;
    }

    private async createSounds(racingGame: RacingGame): Promise<void> {
        await this._soundManager.init(racingGame.playerCar);
    }

    public get aiCarService(): AICarService {
        return this._aiCarService;
    }

    public get collisionService(): CollisionManagerService {
        return this._collisionManager;
    }

    public get cameraService(): CameraManagerService {
        return this._cameraManager;
    }

    public get trackingService(): CarTrackingService {
        return this._trackingManager;
    }

    public get trackService(): TrackService {
        return this._trackService;
    }

    public get gameTimeService(): GameTimeManagerService {
        return this._gameTimeManager;
    }

    public get countdownService(): CountdownService {
        return this._countdownService;
    }

    public get soundService(): SoundManagerService {
        return this._soundManager;
    }

    public get endGameTableService(): EndGameTableService {
        return this._endGameTableService;
    }

    public get highscoreService(): HighscoreService {
        return this._highscoreService;
    }

    public get inputTimeService(): InputTimeService {
        return this._inputTimeService;
    }

    public get keyboardEventHandler(): KeyboardEventHandlerService {
        return this._keyboardEventHandler;
    }
}
