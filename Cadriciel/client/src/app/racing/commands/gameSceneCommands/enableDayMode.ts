import { AbstractGameSceneCommand } from "../abstractGameSceneCommand";
import { GameScene } from "../../scenes/gameScene";
import { Car } from "../../car/car";

export class EnableDayMode extends AbstractGameSceneCommand {

    public constructor(gameScene: GameScene, cars: Car[] ) {
        super(gameScene, cars);
    }

    public execute(): void {
        this._gameScene.changeTimeOfDay(true, this._cars);
    }
}
