import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { AbstractPlayer } from "./abstractPlayer";
import { Car } from "../car/car";
import { AIDebug } from "../artificial-intelligence/ai-debug";

export class HumanPlayer extends AbstractPlayer {

    private _aiDebug: AIDebug;

    public constructor(id: number, keyboardHandler: KeyboardEventHandlerService) {
        super(id, keyboardHandler);
    }

    protected initializeCar(keyboardHandler: KeyboardEventHandlerService): void {
        this._car = new Car(keyboardHandler);
        this._aiDebug = new AIDebug();
    }

    public update(): void {

    }

}
