import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EditorComponent } from "./editor.component";
import { ActivatedRoute } from "@angular/router";

describe("EditorComponent", () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditorComponent],
            providers: [ActivatedRoute]
        }).compileComponents()
            .then()
            .catch((e: Error) => console.error(e.message));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
