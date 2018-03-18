import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EditorComponent } from "./editor.component";
import { ActivatedRoute } from "@angular/router";
import { TrackService } from "../track-service/track.service";
import { RenderService } from "../render-service/render.service";
import { MouseEventHandlerService } from "../event-handlers/mouse-event-handler.service";

describe("EditorComponent", () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditorComponent],
            providers: [ActivatedRoute, TrackService, RenderService, MouseEventHandlerService]
        }).compileComponents()
            .then()
            .catch((e: Error) => console.error(e.message));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should be created", () => {
        expect(component).toBeTruthy();
    });
});
