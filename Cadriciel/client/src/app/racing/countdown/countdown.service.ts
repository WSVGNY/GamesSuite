import { Injectable } from "@angular/core";

@Injectable()
export class CountdownService {
    private _onScreenValue: string;

    public initialize(): void {
        this._onScreenValue = "3";
    }

    public get onScreenValue(): string {
        return this._onScreenValue;
    }

    public decreaseOnScreenValue(): void {
        let countdownNumericValue: number = +this._onScreenValue;
        this._onScreenValue = (--countdownNumericValue).toString();
    }
}
