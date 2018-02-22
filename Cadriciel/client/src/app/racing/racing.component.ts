import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { RenderService } from "./render-service/render.service";
import { Car } from "./car/car";
import { KeyboardEventHandlerService } from "./event-handlers/keyboard-event-handler.service";

@Component({
    moduleId: module.id,
    selector: "app-racing-component",
    templateUrl: "./racing.component.html",
    styleUrls: ["./racing.component.css"]
})

export class RacingComponent implements AfterViewInit {

    @ViewChild("container")
    private containerRef: ElementRef;

    public constructor(
        private renderService: RenderService,
        private keyboardEventHandlerService: KeyboardEventHandlerService
    ) { }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        this.keyboardEventHandlerService.handleKeyDown(event, this.car);
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        this.keyboardEventHandlerService.handleKeyUp(event, this.car);
    }

    public ngAfterViewInit(): void {
        this.renderService
            .initialize(this.containerRef.nativeElement)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
        this.keyboardEventHandlerService
            .initialize()
            .then(/* do nothing */)
            .catch((err) => console.error(err));
    }

    public get car(): Car {
        return this.renderService.playerCar;
    }

    public hider(): void {
        document.getElementById("image1").style.display = "none";
        document.getElementById("image2").style.display = "none";
    }
}
