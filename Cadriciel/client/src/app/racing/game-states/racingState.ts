import { State } from "./state";
import { StateTypes } from "./stateTypes";
import { AICar } from "../car/aiCar";

const MS_TO_SEC: number = 0.001;

export class RacingState extends State {

    public init(): void {
        this._serviceLoader.cameraService.bindCameraKey();
        this._serviceLoader.gameTimeService.resetStartDate();
        this._serviceLoader.gameTimeService.updateLastDate();
        this._racingGame.bindGameSceneKeys();
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
        for (let i: number = 0; i < this._racingGame.cars.length; ++i) {
            this._racingGame.cars[i].update(timeSinceLastFrame);
            if (this._racingGame.cars[i] instanceof AICar) {
                this._serviceLoader.aiCarService.update(this._racingGame.cars[i] as AICar);
            }
            this._serviceLoader.trackingService.update(
                this._racingGame.cars[i].currentPosition,
                this._racingGame.cars[i].raceProgressTracker
            );

            if (this._serviceLoader.trackingService.isLapComplete(
                this._racingGame.cars[i].currentPosition,
                this._racingGame.cars[i].raceProgressTracker
            )) {
                this._racingGame
                    .getPlayerByUniqueId(this._racingGame.cars[i].uniqueid)
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
