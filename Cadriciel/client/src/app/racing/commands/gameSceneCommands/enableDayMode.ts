import { AbstractGameSceneCommand } from "../abstractGameSceneCommand";

export class EnableDayMode extends AbstractGameSceneCommand {

    public execute(): void {
        this._gameScene.changeTimeOfDay(true, this._cars);
    }
}
