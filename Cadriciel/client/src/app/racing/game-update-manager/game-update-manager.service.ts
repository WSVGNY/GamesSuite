import { Injectable } from "@angular/core";
import { Track } from "../../../../../common/racing/track";
import { Car } from "../car/car";
import { Player } from "../../../../../common/crossword/player";
import { AIDebug } from "../artificial-intelligence/ai-debug";
import { GameScene } from "../scenes/gameScene";
import { TrackService } from "../track/track-service/track.service";
import { AICarService } from "../artificial-intelligence/ai-car.service";
import { CollisionManagerService } from "../collision-manager/collision-manager.service";
import { SoundManagerService } from "../sound-service/sound-manager.service";
import { CameraManagerService } from "../cameras/camera-manager.service";
import { CarTrackingManagerService } from "../carTracking-manager/car-tracking-manager.service";

enum State {
  START_ANIMATION = 1,
  COUNTDOWN,
  RACING,
  END,
}

@Injectable()
export class GameUpdateManagerService {

  private _currentState: State;

  public constructor(
    private _trackingManager: CarTrackingManagerService,
    private _aiCarService: AICarService,
    private _collisionManagerService: CollisionManagerService,
    private _soundManager: SoundManagerService,
    private _cameraManager: CameraManagerService
  ) {
    this._currentState = State.START_ANIMATION;
  }

}
