// tslint:disable:no-magic-numbers
import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";

import { EndGameTableComponent } from "./end-game-table.component";
import { HighscoreService } from "../best-times/highscore.service";
import { InputTimeService } from "../input-time/input-time.service";
import { EndGameTableService } from "./end-game-table.service";
import { CarTrackingManagerService } from "../../carTracking-manager/car-tracking-manager.service";
import { Player } from "../../race-game/player";

describe("EndGameTableComponent", () => {
    let component: EndGameTableComponent;
    let fixture: ComponentFixture<EndGameTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EndGameTableComponent],
            providers: [HighscoreService, InputTimeService, EndGameTableService, CarTrackingManagerService]
        }).compileComponents().then().catch((e: Error) => console.error(e.message));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EndGameTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("the times for each turn are displayed", inject(
        [EndGameTableService],
        (endGameTableService: EndGameTableService) => {
            endGameTableService.players = [new Player(1, "Bill"), new Player(2, "Joe")];
            endGameTableService.players[0].setFirstLapTime(30);
            endGameTableService.players[1].setFirstLapTime(50);
            endGameTableService.players[0].setSecondLapTime(30);
            endGameTableService.players[1].setSecondLapTime(50);
            endGameTableService.players[0].setThirdLapTime(30);
            endGameTableService.players[1].setThirdLapTime(50);
            for (const player of endGameTableService.players) {
                expect(player.score.getFormatedTime(player.score.firstLap)).toBeDefined();
                expect(player.score.getFormatedTime(player.score.secondLap)).toBeDefined();
                expect(player.score.getFormatedTime(player.score.thirdLap)).toBeDefined();
            }
        }));

    it("the total times are displayed", inject(
        [EndGameTableService],
        (endGameTableService: EndGameTableService) => {
            endGameTableService.players = [new Player(1, "Bill"), new Player(2, "Joe")];
            endGameTableService.players[0].setTotalTime(100);
            endGameTableService.players[1].setTotalTime(200);
            for (const player of endGameTableService.players) {
                expect(player.score.getFormatedTime(player.score.totalTime)).toBeDefined();
            }
        }));

    it("the players are displayed in the good order", inject(
        [EndGameTableService],
        (endGameTableService: EndGameTableService) => {
            const players: Player[] = [
                new Player(1, "Bill"),
                new Player(2, "Joe"),
                new Player(3, "JoeBlo"),
                new Player(4, "Jav"),
                new Player(5, "Joy")];
            players[1].setTotalTime(500);
            players[3].setTotalTime(300);
            players[2].setTotalTime(200);
            players[4].setTotalTime(400);
            players[0].setTotalTime(100);
            endGameTableService.setPlayers(players);
            for (let i: number = 0; i < 4; i++) {
                expect(endGameTableService.players[i].score.totalTime)
                    .toBeLessThan(endGameTableService.players[i + 1].score.totalTime);
            }
        }));
});
