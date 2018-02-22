import { Component } from "@angular/core";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {

    public readonly title: string = "LOG2990";
    public showImages(): void {
        document.getElementById("image1").style.display = "inline-block";
        document.getElementById("image2").style.display = "inline-block";
    }

    public hide(): void {
        document.getElementById("image1").style.display = "none";
        document.getElementById("image2").style.display = "none";
    }

}
