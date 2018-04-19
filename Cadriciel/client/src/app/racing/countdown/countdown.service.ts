import { Injectable } from "@angular/core";
import { COUNTDOWN_INITIAL_TEXT } from "../constants/scene.constants";

@Injectable()
export class CountdownService {
    public onScreenValue: string;
    public isCountdownOver: boolean;

    public initialize(): void {
        this.onScreenValue = COUNTDOWN_INITIAL_TEXT;
        this.isCountdownOver = false;
    }

    public decreaseOnScreenValue(): void {
        let countdownNumericValue: number = +this.onScreenValue;
        this.onScreenValue = (--countdownNumericValue).toString();
    }
}
