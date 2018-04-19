// tslint:disable:no-magic-numbers
import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { Player } from "../../race-game/player";
import { InputNameComponent } from "./input-name.component";
import { HighscoreService } from "../highscores/highscore.service";
import { InputNameService } from "./input-name.service";

describe("InputTimeComponent", () => {
    let component: InputNameComponent;
    let fixture: ComponentFixture<InputNameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InputNameComponent],
            providers: [HighscoreService, InputNameService]
        }).compileComponents().then().catch((e: Error) => console.error(e.message));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InputNameComponent);
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
