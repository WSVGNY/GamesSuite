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

            it("the times for the first lap are defined", () => {
                endGameTableService.players[0].setFirstLapTime(30);
                endGameTableService.players[1].setFirstLapTime(50);
                for (const player of endGameTableService.players) {
                    expect(player.score.getFormatedTime(player.score.firstLap)).toBeDefined();
                }
            });

            it("the times for the first lap are defined", () => {
                endGameTableService.players[0].setSecondLapTime(30);
                endGameTableService.players[1].setSecondLapTime(50);
                for (const player of endGameTableService.players) {
                    expect(player.score.getFormatedTime(player.score.secondLap)).toBeDefined();
                }
            });

            it("the times for the first lap are defined", () => {
                endGameTableService.players[0].setThirdLapTime(30);
                endGameTableService.players[1].setThirdLapTime(50);
                for (const player of endGameTableService.players) {
                    expect(player.score.getFormatedTime(player.score.thirdLap)).toBeDefined();
                }
            });
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

    it("the players are displayed in the good order", () => {
        expect(false).toBeTruthy();
    });
});
