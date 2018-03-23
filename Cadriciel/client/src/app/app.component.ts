import { Component } from "@angular/core";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {

    public readonly title: string = "LOG2990";
    public imageIsShown: boolean = false;

    public showImages(): void {
        this.imageIsShown = true;
    }

    public hide(): void {
        this.imageIsShown = false;
    }

}
