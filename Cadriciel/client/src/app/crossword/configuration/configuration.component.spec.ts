import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfigurationComponent } from "./configuration.component";
import assert = require("assert");
import { GridService } from "../grid.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { ConfigurationService } from "../configuration.service";
import { Difficulty } from "../../../../../common/crossword/difficulty";

describe("ConfigurationComponent", () => {
    let component: ConfigurationComponent;
    let fixture: ComponentFixture<ConfigurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ConfigurationComponent],
            providers: [
                GridService,
                HttpClient,
                HttpHandler,
                ConfigurationService
            ]
        })
            .compileComponents()
            .then()
            .catch((e: Error) => console.error(e.message));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should toggle 'new game' on click", () => {
        component.setNewGame();
        expect(component.isNewGame).toEqual(true);
    });

    it("should toggle 'join game' on click", () => {
        component.setJoinGame();
        expect(component.isJoinGame).toEqual(true);
    });

    it("should toggle 'two player game' to true on click", () => {
        component.configurationService.isTwoPlayerGame = true;
        expect(component.configurationService.isTwoPlayerGame).toEqual(true);
    });

    it("should toggle 'single player game' on click", () => {
        component.configurationService.isTwoPlayerGame = false;
        expect(component.configurationService.isTwoPlayerGame).toEqual(false);
    });

    it("should toggle 'chose grid difficulty' on click", () => {
        component.makeEasyGrid();
        expect(component.choseGridDifficulty).toEqual(true);
    });

    it("When the user submits his name it is saved to the service", () => {
        component.configurationService.playerName = "Player1";
        expect(component.configurationService.playerName).toEqual("Player1");
    });

    it("When the user submits his name, the game configuration is over", () => {
        component.submitName();
        expect(component.configurationService.configurationDone).toEqual(true);
    });

    describe("tests for the difficulty", () => {

        it("should set grid difficulty to Easy on click", () => {
            component.makeEasyGrid();
            expect(component.difficulty).toEqual(Difficulty.Easy);
        });

        it("should set grid difficulty to Medium on click", () => {
            component.makeMediumGrid();
            expect(component.difficulty).toEqual(Difficulty.Medium);
        });

        it("should set grid difficulty to Hard on click", () => {
            component.makeHardGrid();
            expect(component.difficulty).toEqual(Difficulty.Hard);
        });

    });

});
