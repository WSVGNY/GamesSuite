import { Component } from "@angular/core";
import { CountdownService } from "./countdown.service";

@Component({
    selector: "app-countdown",
    templateUrl: "./countdown.component.html",
    styleUrls: ["./countdown.component.css"]
})
export class CountdownComponent {
    public constructor(private countdownService: CountdownService) { }

    public isCountdownOver(): boolean {
        return this.countdownService.isCountdownOver;
    }

    public countdownOnScreenValue(): string {
        return this.countdownService.onScreenValue;
    }
}
