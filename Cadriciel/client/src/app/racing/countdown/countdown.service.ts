import { Injectable } from "@angular/core";

@Injectable()
export class CountdownService {
    public onScreenValue: string;
    public isCountdownOver: boolean;

    public initialize(): void {
        this.onScreenValue = "3";
        this.isCountdownOver = false;
    }

    public decreaseOnScreenValue(): void {
        let countdownNumericValue: number = +this.onScreenValue;
        this.onScreenValue = (--countdownNumericValue).toString();
    }
}
