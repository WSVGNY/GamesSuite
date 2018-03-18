import { AbstractCommand } from "./abstractCommand";
import { GameScene } from "../scenes/gameScene";
import { Car } from "../car/car";

export abstract class AbstractGameSceneCommand extends AbstractCommand {
    protected _gameScene: GameScene;
    protected _cars: Car[];

    public constructor(gameScene: GameScene, cars: Car[] ) {
        super();
        this._gameScene = gameScene;
        this._cars = cars;
    }

    public abstract execute(): void;
}
