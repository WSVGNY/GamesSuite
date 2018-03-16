import { AbstractGameSceneCommand } from "../abstractGameSceneCommand";

export class EnableNightMode extends AbstractGameSceneCommand {

    public execute(): void {
        this._gameScene.changeTimeOfDay(false, this._cars);
    }
}
