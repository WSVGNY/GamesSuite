import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HighscoreService } from "./highscore.service";
import { HighscoreComponent } from "./highscore.component";

describe("BestTimesComponent", () => {
    let component: HighscoreComponent;
    let fixture: ComponentFixture<HighscoreComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HighscoreComponent],
            providers: [HighscoreService]
        }).compileComponents().then().catch((e: Error) => console.error(e.message));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HighscoreComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
