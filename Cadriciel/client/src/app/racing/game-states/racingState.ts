import { State } from "./state";
import { StateTypes } from "./stateTypes";
import { AICar } from "../car/aiCar";
import { Player } from "../race-game/player";

const MS_TO_SEC: number = 0.001;

export class RacingState extends State {

    public init(): void {
        this._serviceLoader.cameraService.bindCameraKey();
        this._serviceLoader.gameTimeService.resetStartDate();
        this._serviceLoader.gameTimeService.updateLastDate();
    }

    public update(): void {
        this._serviceLoader.soundService.setAccelerationSound(this._racingGame.playerCar);
        if (this.updateCars(this._serviceLoader.gameTimeService.getTimeSinceLastFrame())) {
            this.advanceToNextState();
        }
        this._serviceLoader.collisionService.update(this._racingGame.cars);
        this._serviceLoader.cameraService.updateCameraPositions(this._racingGame.playerCarPosition);
        this._serviceLoader.gameTimeService.updateLastDate();
    }

    private updateCars(timeSinceLastFrame: number): boolean {
        for (let i: number = 0; i < this._racingGame.cars.length; ++i) {
            this._racingGame.cars[i].update(timeSinceLastFrame);
            const donePlayer: Player = this._racingGame.players.find((player: Player) => player.id === this._racingGame.cars[i].uniqueid);
            if (this._racingGame.cars[i] instanceof AICar) {
                this._serviceLoader.aiCarService.update(this._racingGame.cars[i] as AICar, this._racingGame.aiCarDebugs[i]);
                if (this.updateTrackingService(i)) {
                    this.logTime(donePlayer, i);
                }
            } else {
                if (this.updateTrackingService(i)) {
                    this.logTime(donePlayer, i);

                    return true;
                }
            }
        }

        return false;
    }

    private updateTrackingService(carIndex: number): boolean {
        return this._serviceLoader.trackingService.update(
            this._racingGame.cars[carIndex].currentPosition,
            this._racingGame.cars[carIndex].raceProgressTracker);
    }

    private logTime(donePlayer: Player, carIndex: number): void {
        donePlayer.setTotalTime(this._serviceLoader.gameTimeService.getElaspedTime() * MS_TO_SEC);
        this._racingGame.cars[carIndex].raceProgressTracker.isTimeLogged = true;
    }

    public isStateOver(): boolean {
        return false;
    }

    public advanceToNextState(): void {
        this._serviceLoader.soundService.stopAllSounds();
        this._racingGame.setState(StateTypes.Results);
    }
}
