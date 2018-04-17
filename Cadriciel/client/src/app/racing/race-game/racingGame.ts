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
    private _isCountdownOver: boolean;
    private _currentCamera: Camera;
    private _aspectRatio: number;

    public constructor() { }

    private async initializeGameFromTrack(track: Track, keyboardHandler: KeyboardEventHandlerService): Promise<void> {
        this.initializeCars(keyboardHandler);
        this._gameScene.loadTrack(track);
        // await this.createSounds();
        await this._gameScene.loadCars(this._cars, this._aiCarDebugs, this._currentCamera, this._track.type);
        // this._soundManager.accelerationSoundEffect.play();
        this._gameScene.bindGameSceneKeys(this._cars);
    }

    private initializeCars(keyboardHandler: KeyboardEventHandlerService): void {
        for (let i: number = 0; i < AI_CARS_QUANTITY + 1; ++i) {
            if (i === 0) {
                this._cars.push(new HumanCar(i, keyboardHandler));
                this._players.push(new Player(i, CURRENT_PLAYER));
            } else if (i - 1 % AI_PERSONALITY_QUANTITY === 0) {
                this._cars.push(new AICar(i, Personality.Larry));
                this._players.push(new Player(i, COMPUTER_PLAYER + (i + 1)));
            } else if (i - 1 % AI_PERSONALITY_QUANTITY === 1) {
                this._cars.push(new AICar(i, Personality.Curly));
                this._players.push(new Player(i, COMPUTER_PLAYER + (i + 1)));
            } else if (i - 1 % AI_PERSONALITY_QUANTITY === 2) {
                this._cars.push(new AICar(i, Personality.Moe));
                this._players.push(new Player(i, COMPUTER_PLAYER + (i + 1)));
            }
            this._aiCarDebugs.push(new AIDebug());
        }
    }

    public get aspectRatio(): number {
        return this.aspectRatio;
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
        this._isCountdownOver = value;
    }

}
