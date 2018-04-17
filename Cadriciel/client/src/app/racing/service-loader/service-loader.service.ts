import { Injectable } from "@angular/core";
import { RacingGame } from "../race-game/racingGame";
import { AICarService } from "../artificial-intelligence/ai-car.service";
import { CollisionManagerService } from "../collision-manager/collision-manager.service";
import { CameraManagerService } from "../cameras/camera-manager.service";
import { CarTrackingManagerService } from "../carTracking-manager/car-tracking-manager.service";
import { GameTimeManagerService } from "../game-time-manager/game-time-manager.service";
import { CountdownService } from "../countdown/countdown.service";
import { SoundManagerService } from "../sound-service/sound-manager.service";
import { EndGameTableService } from "../scoreboard/end-game-table/end-game-table.service";

@Injectable()
export class ServiceLoaderService {
  public constructor(
    private _aiCarService: AICarService,
    private _collisionManager: CollisionManagerService,
    private _cameraManager: CameraManagerService,
    private _trackingManager: CarTrackingManagerService,
    private _gameTimeManager: GameTimeManagerService,
    private _countdownService: CountdownService,
    private _soundManager: SoundManagerService,
    private _endGameTableService: EndGameTableService
  ) { }

  public async initializeServices(racingGame: RacingGame): Promise<void> {
    this._aiCarService.initialize(racingGame.gameScene.trackMesh.trackPoints.toVectors3);
    this._collisionManager.track = racingGame.gameScene.trackMesh;
    this._cameraManager.initializeSpectatingCameraPosition(racingGame.playerCar.currentPosition, racingGame.playerCar.direction);
    this._trackingManager.init(racingGame.gameScene.trackMesh.trackPoints.toVectors3);
    this._gameTimeManager.initializeDates();
    this._countdownService.initialize();
    await this.createSounds(racingGame);
    console.log("done");
  }

  private async createSounds(racingGame: RacingGame): Promise<void> {
    await this._soundManager.createStartingSound(racingGame.playerCar);
    await this._soundManager.createMusic(racingGame.playerCar);
    await this._soundManager.createCarCollisionSound(racingGame.playerCar);
    await this._soundManager.createAccelerationSound(racingGame.playerCar);
    await this._soundManager.createWallCollisionSound(racingGame.playerCar);
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

  public get trackingService(): CarTrackingManagerService {
    return this._trackingManager;
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


}
