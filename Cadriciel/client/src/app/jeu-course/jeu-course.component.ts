import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { RenderService } from "./render-service/render.service";
import { Car } from "./car/car";

@Component({
    moduleId: module.id,
    selector: "app-jeu-course-component",
    templateUrl: "./jeu-course.component.html",
    styleUrls: ["./jeu-course.component.css"]
})

export class JeuCourseComponent implements AfterViewInit {

    @ViewChild("container")
    private containerRef: ElementRef;

    public constructor(private renderService: RenderService) { }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        this.renderService.handleKeyDown(event);
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        this.renderService.handleKeyUp(event);
    }

    public ngAfterViewInit(): void {
        this.renderService
            .initialize(this.containerRef.nativeElement)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
    }

    public get car(): Car {
        return this.renderService.car;
    }

    @HostListener("window:mousedown", ["$event"])
    public onMouseDown(event: MouseEvent): void {
        this.renderService.handleMouseDown(event);
    }

    @HostListener("window:mouseup", ["$event"])
    public onMouseUp(event: MouseEvent): void {
        this.renderService.handleMouseUp(event);
    }
}
