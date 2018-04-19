import { State } from "./state";
import { StateType } from "./stateTypes";
import { AICar } from "../car/aiCar";
import { MS_TO_SECONDS } from "../constants/math.constants";

export class RacingState extends State {

    public initialize(): void {
        this._serviceLoader.cameraService.bindCameraKey();
        this._serviceLoader.gameTimeService.resetStartDate();
        this._serviceLoader.gameTimeService.updateLastDate();
        this._racingGame.bindGameSceneKeys();
    }

    public update(): void {
        this.updateCars(this._serviceLoader.gameTimeService.getTimeSinceLastFrame());
        this._serviceLoader.soundService.setAccelerationSound(this._racingGame.playerCar);
        this._serviceLoader.carCollisionService.update(this._racingGame.cars, this._serviceLoader.soundService);
        this._serviceLoader.wallCollisionService.update(this._racingGame.cars, this._serviceLoader.soundService);
        this._serviceLoader.cameraService.updateCameraPositions(this._racingGame.playerCarPosition);
        this._serviceLoader.gameTimeService.updateLastDate();
        if (this.isStateOver()) {
            this.advanceToNextState();
        }
    }

    private updateCars(timeSinceLastFrame: number): void {
        for (const car of this._racingGame.cars) {
            car.update(timeSinceLastFrame);
            if (car instanceof AICar) {
                this._serviceLoader.aiCarService.update(car as AICar);
            }
            this._serviceLoader.trackingService.update(car.currentPosition, car.raceProgressTracker);
            if (this._serviceLoader.trackingService.isLapComplete(car.currentPosition, car.raceProgressTracker)) {
                this._racingGame.getPlayerByUniqueId(car.uniqueid)
                    .pushLapTime(this._serviceLoader.gameTimeService.getElaspedTime() * MS_TO_SECONDS);
            }
        }
    }

    protected isStateOver(): boolean {
        return this._racingGame.playerCar.raceProgressTracker.isRaceCompleted;
    }

    protected advanceToNextState(): void {
        this._serviceLoader.soundService.stopAllSounds();
        this._serviceLoader.keyboardEventHandler.unbindAllKeys();
        this._racingGame.setState(StateType.Results);
    }
}
