import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { InputTimeComponent } from "./input-time.component";
import { InputTimeService } from "./input-time.service";
import { HighscoreService } from "../best-times/highscore.service";

describe("InputTimeComponent", () => {
    let component: InputTimeComponent;
    let fixture: ComponentFixture<InputTimeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InputTimeComponent],
            providers: [HighscoreService, InputTimeService]
        }).compileComponents().then().catch((e: Error) => console.error(e.message));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InputTimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
