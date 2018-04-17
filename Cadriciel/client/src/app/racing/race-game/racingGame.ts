import { Player } from "./player";
import { Track } from "../../../../../common/racing/track";
import { GameScene } from "../scenes/gameScene";
import { Vector3, Camera } from "three";
import { AI_CARS_QUANTITY, AI_PERSONALITY_QUANTITY } from "../constants/ai.constants";
import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { HumanCar } from "../car/humanCar";
import { AICar } from "../car/aiCar";
import { Personality } from "../artificial-intelligence/ai-config";
import { COMPUTER_PLAYER, CURRENT_PLAYER } from "../constants/global.constants";
import { AbstractCar } from "../car/abstractCar";
import { State } from "../game-states/state";
import { StateFactoryService } from "../game-states/state-factory/state-factory.service";
import { StateTypes } from "../game-states/stateTypes";

export class RacingGame {

    public countdownOnScreenValue: string;
    private _players: Player[];
    private _cars: AbstractCar[];
    private _track: Track;
    private _gameScene: GameScene;
    private _currentState: State;

    public constructor(
        private _keyboardHandler: KeyboardEventHandlerService,
        private _stateFactory: StateFactoryService,
    ) {
        this._players = [];
        this._cars = [];
        this._gameScene = new GameScene(this._keyboardHandler);
        this.initializeCars(this._keyboardHandler);
    }

    public startGame(): void {
        this.setState(StateTypes.Opening);
    }

    public setState(stateType: StateTypes): void {
        this._currentState = this._stateFactory.getState(stateType, this);
        this._currentState.init();
    }

    public update(): void {
        this._currentState.update();
    }

    private initializeCars(keyboardHandler: KeyboardEventHandlerService): void {
        this.createPlayerCar(keyboardHandler);
        for (let i: number = 1; i < AI_CARS_QUANTITY + 1; ++i) {
            this.createAICar(i);
        }
    }

    private createPlayerCar(keyboardHandler: KeyboardEventHandlerService): void {
        this._cars.push(new HumanCar(0, keyboardHandler));
        this._players.push(new Player(0, CURRENT_PLAYER));
    }

    private createAICar(index: number): void {
        this._cars.push(new AICar(index, this.getRandomPersonnality()));
        this._players.push(new Player(index, COMPUTER_PLAYER + (index + 1)));
    }

    public async initializeGameFromTrack(track: Track, thirdPersonCamera: Camera): Promise<void> {
        this._track = track;
        this._gameScene.loadTrack(track);
        await this._gameScene.loadCars(this._cars, thirdPersonCamera, track.type);
        this._gameScene.bindGameSceneKeys(this._cars);

    }

    public get players(): Player[] {
        return this._players;
    }

    public get cars(): AbstractCar[] {
        return this._cars;
    }

    public get track(): Track {
        return this._track;
    }

    public get gameScene(): GameScene {
        return this._gameScene;
    }

    public getPlayerByUniqueId(id: number): Player {
        return this._players.find((player: Player) => player.uniqueid === id);
    }

    public get playerCar(): AbstractCar {
        return this._cars.find((car: AbstractCar) => car.uniqueid === 0);
    }

    public get playerCarPosition(): Vector3 {
        return this._cars.find((car: AbstractCar) => car.uniqueid === 0).currentPosition;
    }

    public set isCountdownOver(value: boolean) {
        // this._isCountdownOver = value;
    }

    private getRandomPersonnality(): Personality {
        switch (Math.floor(Math.random() * (AI_PERSONALITY_QUANTITY + 1))) {
            case 0:
                return Personality.Larry;
            case 1:
                return Personality.Curly;
            case 2:
                return Personality.Moe;
            default:
                return Personality.Larry;
        }
    }

}
