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
import { AIDebug } from "../artificial-intelligence/ai-debug";
import { AbstractCar } from "../car/abstractCar";

export class RacingGame {

    public countdownOnScreenValue: string;

    private _players: Player[];
    private _cars: AbstractCar[];
    private _track: Track;
    private _gameScene: GameScene;
    private _aiCarDebugs: AIDebug[];
    // private _isCountdownOver: boolean;

    public constructor(
        private _keyboardHandler: KeyboardEventHandlerService,
    ) {
        this._players = [];
        this._cars = [];
        this._aiCarDebugs = [];
        this._gameScene = new GameScene(this._keyboardHandler);
        this.initializeCars(this._keyboardHandler);
    }

    private initializeCars(keyboardHandler: KeyboardEventHandlerService): void {
        this._cars.push(new HumanCar(0, keyboardHandler));
        this._players.push(new Player(0, CURRENT_PLAYER));
        this._aiCarDebugs.push(new AIDebug());
        for (let i: number = 1; i < AI_CARS_QUANTITY + 1; ++i) {
            this._cars.push(new AICar(i, this.getRandomPersonnality()));
            this._players.push(new Player(i, COMPUTER_PLAYER + (i + 1)));
            this._aiCarDebugs.push(new AIDebug());
        }
    }

    public async initializeGameFromTrack(track: Track, thirdPersonCamera: Camera): Promise<void> {
        this._gameScene.loadTrack(track);
        this._gameScene.createStartingLine();
        await this._gameScene.loadCars(this._cars, this._aiCarDebugs, thirdPersonCamera, track.type);
        // await this.createSounds();
        // this._soundManager.accelerationSoundEffect.play();
        this._gameScene.bindGameSceneKeys(this._cars);
    }

    public get playerCarPosition(): Vector3 {
        return undefined;
    }

    public get currentCamera(): Camera {
        return undefined;
    }

    public get players(): Player[] {
        return this._players;
    }

    public get cars(): AbstractCar[] {
        return this._cars;
    }

    public get aiCarDebugs(): AIDebug[] {
        return this._aiCarDebugs;
    }

    public get track(): Track {
        return this._track;
    }

    public get gameScene(): GameScene {
        return this._gameScene;
    }

    public getPlayerById(id: number): Player {
        return this._players.find((player: Player) => player.id === id);
    }

    public get playerCar(): AbstractCar {
        return this._cars.find((car: AbstractCar) => car.uniqueid === 0);

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
