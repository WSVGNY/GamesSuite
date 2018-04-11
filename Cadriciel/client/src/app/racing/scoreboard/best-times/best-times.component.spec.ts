import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BestTimesComponent } from "./best-times.component";
import { HighscoreService } from "./highscore.service";

describe("BestTimesComponent", () => {
    let component: BestTimesComponent;
    let fixture: ComponentFixture<BestTimesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BestTimesComponent],
            providers: [HighscoreService]
        }).compileComponents().then().catch((e: Error) => console.error(e.message));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BestTimesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
