import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EndGameTableComponent } from "./end-game-table.component";
import { HighscoreService } from "../best-times/highscore.service";
import { InputTimeService } from "../input-time/input-time.service";
import { EndGameTableService } from "./end-game-table.service";

describe("EndGameTableComponent", () => {
    let component: EndGameTableComponent;
    let fixture: ComponentFixture<EndGameTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EndGameTableComponent],
            providers: [HighscoreService, InputTimeService, EndGameTableService]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EndGameTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
