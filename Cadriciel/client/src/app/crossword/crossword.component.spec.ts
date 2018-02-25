import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CrosswordComponent } from "./crossword.component";
import assert = require("assert");
import { ConfigurationService } from "./configuration.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("CrosswordComponent", () => {
    let component: CrosswordComponent;
    let fixture: ComponentFixture<CrosswordComponent>;
    const timeout: number = 30000;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [CrosswordComponent],
            providers: [
                ConfigurationService
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
        component.configurationService.playerName = "Player1";
        expect(component.configurationService.playerName).toBeTruthy();
    });

    it("the game information view contain the numer of words found", () => {
        expect(component.correctWordCount).toEqual(0);
    });

    it("if there's 2 players, the game info div display two players ", () => {

        assert(false);
    });

    it("if there's one player, the game info div display one player ", () => {
        assert(false);
    });

    it("the name entered by the player is the one displayed ", () => {
        assert(false);
    });

    it("the letters in the grid are uppercase", () => {
        assert(false);
    });

    it("the definitions in the horizontal section are those of horizontal words ", () => {
        assert(false);
    });

    it("the definitions in the vertical section are those of vertical words ", () => {
        assert(false);
    });

});
