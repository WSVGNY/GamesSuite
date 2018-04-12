import { KeyboardEventHandlerService } from "../event-handlers/keyboard-event-handler.service";
import { AbstractPlayer } from "./abstractPlayer";
import { Car } from "../car/car";

export class HumanPlayer extends AbstractPlayer {

    public constructor(id: number, keyboardHandler: KeyboardEventHandlerService) {
        super(id, keyboardHandler);
    }

    protected initializeCar(keyboardHandler: KeyboardEventHandlerService): void {
        this._car = new Car(keyboardHandler, false);
    }

    public update(): void {

    }

}
