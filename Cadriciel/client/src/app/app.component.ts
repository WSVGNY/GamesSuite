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
/*
    public removeImages(): void {
        const elem: HTMLElement = document.getElementById("aa");
        elem.parentNode.removeChild(elem);
        const elemm: HTMLElement = document.getElementById("bb");
        elemm.parentNode.removeChild(elemm);
    }
    */
}
