import { State } from "./state";
import { StateTypes } from "./stateTypes";
import { AICar } from "../car/aiCar";

const MS_TO_SEC: number = 0.001;

export class RacingState extends State {

    public init(): void {
        this._serviceLoader.cameraService.bindCameraKey();
        this._serviceLoader.gameTimeService.resetStartDate();
        this._serviceLoader.gameTimeService.updateLastDate();
    }

    public update(): void {
        this.updateCars(this._serviceLoader.gameTimeService.getTimeSinceLastFrame());
        if (this.isStateOver()) {
            this.advanceToNextState();
        } else {
            this._serviceLoader.soundService.setAccelerationSound(this._racingGame.playerCar);
            this._serviceLoader.collisionService.update(this._racingGame.cars);
            this._serviceLoader.cameraService.updateCameraPositions(this._racingGame.playerCarPosition);
            this._serviceLoader.gameTimeService.updateLastDate();
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
                    .pushLapTime(this._serviceLoader.gameTimeService.getElaspedTime() * MS_TO_SEC);
            }
        }
    }

    public isStateOver(): boolean {
        return this._racingGame.playerCar.raceProgressTracker.isRaceCompleted;
    }

    public advanceToNextState(): void {
        this._serviceLoader.soundService.stopAllSounds();
        this._racingGame.setState(StateTypes.Results);
    }
}
