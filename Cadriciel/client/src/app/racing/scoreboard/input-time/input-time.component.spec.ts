// tslint:disable:no-magic-numbers
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { InputTimeComponent } from "./input-time.component";
import { InputTimeService } from "./input-time.service";
import { HighscoreService } from "../best-times/highscore.service";
import { Player } from "../../race-game/player";
import { CommonHighscore } from "../../../../../../common/racing/commonHighscore";

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

    it("if player is first and is one of the best time, he can enter his name", () => {
        // const highscoreService: HighscoreService;
        // const player1: Player;
        // const highscore: CommonHighscore = [{ car: "camaro", name: "Gilles", position: 1, time: 200 }];
        // player1.position = 1;
        // player1.score.totalTime = 100;
        // expect(highscoreService.isNewHighScore(player1)).toBeTruthy();
        expect(false).toBeTruthy();
    });
});
