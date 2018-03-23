import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CrosswordComponent } from "./crossword.component";
import assert = require("assert");
import { ConfigurationService } from "./configuration/configuration.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MultiplayerCommunicationService } from "./multiplayer-communication.service";

describe("CrosswordComponent", () => {
    let component: CrosswordComponent;
    let fixture: ComponentFixture<CrosswordComponent>;
    const timeout: number = 30000;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [CrosswordComponent],
            providers: [
                ConfigurationService,
                MultiplayerCommunicationService
            ]
        })
            .compileComponents()
            .then()
            .catch((e: Error) => console.error(e.message));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CrosswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("the view contains a grid", () => {
        it("contains a grid", (done: () => void) => {
            setTimeout(() => done(), timeout);
            expect(component.configurationService.grid).toBeTruthy();
        });

    });

    it("the view contains definitions", () => {
        it("contains definitions", (done: () => void) => {
            setTimeout(() => done(), timeout);
            expect(component.configurationService.grid.words[0].definition).toBeTruthy();
        });
    });

    it("the game information view contain the name of the player", () => {
        component.configurationService.playerOne.name = "Player1";
        expect(component.configurationService.playerOne.name).toBeTruthy();
    });

    it("the game information view contain the numer of words found", () => {
        expect(component.configurationService.currentPlayer.score).toEqual(0);
    });

    it("should have 2 players, if the game is set to two players ", () => {
        component.configurationService.isTwoPlayerGame = true;
        expect(component.configurationService.isTwoPlayerGame).toEqual(true);
    });

    it("should have 1 player, if the game is set to single player ", () => {
        component.configurationService.isTwoPlayerGame = false;
        expect(component.configurationService.isTwoPlayerGame).toEqual(false);
    });

    it("the name entered by the player is the one displayed ", () => {
        component.configurationService.playerOne.name = "Player1";
        expect(component.configurationService.playerTwo.name).toEqual("Player1");
    });

    it("the letters in the grid are uppercase", () => {
        it("contains a grid", (done: () => void) => {
            setTimeout(() => done(), timeout);
            for (const line of component.configurationService.grid.boxes) {
                for (const box of line) {
                    if (box.char.value !== "#" && box.char.value !== box.char.value.toUpperCase()) {
                        assert(false);
                    }
                }
            }
            assert(true);
        });
    });

});
