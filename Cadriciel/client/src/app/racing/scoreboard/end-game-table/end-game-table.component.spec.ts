// tslint:disable:no-magic-numbers
import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";

import { EndGameTableComponent } from "./end-game-table.component";
import { HighscoreService } from "../best-times/highscore.service";
import { InputTimeService } from "../input-time/input-time.service";
import { EndGameTableService } from "./end-game-table.service";
import { Player } from "../../race-game/player";
import { CarTrackingService } from "../../tracking-service/tracking.service";

describe("EndGameTableComponent", () => {
    let component: EndGameTableComponent;
    let fixture: ComponentFixture<EndGameTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EndGameTableComponent],
            providers: [HighscoreService, InputTimeService, EndGameTableService, CarTrackingService]
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
            endGameTableService.players[0].score.lapTimes = [100, 200, 300];
            endGameTableService.players[1].score.lapTimes = [50, 200, 400];
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
            endGameTableService.players[0].score.lapTimes = [100, 200, 300];
            endGameTableService.players[0].score.lapTimes = [50, 100, 200];
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
                new Player(3, "JoeBlo")];
            players[0].score.lapTimes = [100, 200, 300];
            players[1].score.lapTimes = [100, 200, 400];
            players[2].score.lapTimes = [200, 250, 270];
            endGameTableService.setPlayers(players);
            for (let i: number = 0; i < 2; i++) {
                expect(endGameTableService.players[i].score.totalTime)
                    .toBeLessThan(endGameTableService.players[i + 1].score.totalTime);
            }
        }));
});
