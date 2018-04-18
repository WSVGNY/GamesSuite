// tslint:disable:no-magic-numbers
import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { InputTimeComponent } from "./input-time.component";
import { InputTimeService } from "./input-time.service";
import { HighscoreService } from "../best-times/highscore.service";
import { Player } from "../../race-game/player";

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

    it("if player is first and is one of the best time, he can enter his name", inject(
        [HighscoreService],
        (highscoreService: HighscoreService) => {
            const player1: Player = new Player(1, "Mathieu");
            highscoreService.highscores =
                [
                    { car: "camaro", name: "Gilles", position: 1, time: 200 },
                    { car: "camaro", name: "Gilles", position: 1, time: 200 },
                    { car: "camaro", name: "Gilles", position: 1, time: 200 },
                    { car: "camaro", name: "Gilles", position: 1, time: 200 },
                    { car: "camaro", name: "Gilles", position: 1, time: 200 }];
            player1.position = 1;
            player1.score.lapTimes = [50, 100, 170];
            expect(highscoreService.isNewHighScore(player1)).toBeTruthy();
        }));

    it("if player is first and is not one of the best time, he can not enter his name", inject(
        [HighscoreService],
        (highscoreService: HighscoreService) => {
            const player1: Player = new Player(1, "Mathieu");
            highscoreService.highscores =
                [
                    { car: "camaro", name: "Gilles", position: 1, time: 200 },
                    { car: "camaro", name: "Gilles", position: 1, time: 200 },
                    { car: "camaro", name: "Gilles", position: 1, time: 200 },
                    { car: "camaro", name: "Gilles", position: 1, time: 200 },
                    { car: "camaro", name: "Gilles", position: 1, time: 200 }];
            player1.position = 1;
            player1.score.lapTimes = [50, 100, 999];
            expect(highscoreService.isNewHighScore(player1)).toBeFalsy();
        }));

    it("if player is not first and is one of the best time, he can not enter his name", inject(
        [HighscoreService],
        (highscoreService: HighscoreService) => {
            const player1: Player = new Player(1, "Mathieu");
            highscoreService.highscores =
                [
                    { car: "camaro", name: "Gilles", position: 1, time: 200 },
                    { car: "camaro", name: "Gilles", position: 1, time: 200 },
                    { car: "camaro", name: "Gilles", position: 1, time: 200 },
                    { car: "camaro", name: "Gilles", position: 1, time: 200 },
                    { car: "camaro", name: "Gilles", position: 1, time: 200 }];
            player1.position = 2;
            player1.score.lapTimes = [50, 100, 170];
            expect(highscoreService.isNewHighScore(player1)).toBeFalsy();
        }));
});
