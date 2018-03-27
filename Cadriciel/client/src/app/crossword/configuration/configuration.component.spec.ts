import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfigurationComponent } from "./configuration.component";
import { GridService } from "../grid.service";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { ConfigurationService } from "../configuration/configuration.service";
import { Difficulty } from "../../../../../common/crossword/difficulty";
import { MultiplayerCommunicationService } from "../multiplayer-communication.service";
import { Player } from "../../../../../common/crossword/player";

describe("ConfigurationComponent", () => {
    let component: ConfigurationComponent;
    let fixture: ComponentFixture<ConfigurationComponent>;

    const createMockPlayer: Function = (colorString: string, nameString: string, scoreNumber: number) => {
        return {
            color: colorString,
            name: nameString,
            score: scoreNumber
        } as Player;
    };

    beforeEach(async((done: () => void) => {
        TestBed.configureTestingModule({
            declarations: [ConfigurationComponent],
            providers: [
                GridService,
                HttpClient,
                HttpHandler,
                ConfigurationService,
                MultiplayerCommunicationService
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

    it("should toggle 'chose grid difficulty' on click", () => {
        component.makeEasyGrid();
        expect(component.choseGridDifficulty).toEqual(true);
    });

    it("When the user submits his name it is saved to the service", () => {
        component.configurationService.playerOne = createMockPlayer("color", "name", 0);
        component.configurationService.playerOne.name = "Player1";
        expect(component.configurationService.playerOne.name).toEqual("Player1");
    });

    it("When the user submits his name, the game configuration is over", () => {
        component.submitName("playerName");
        expect(component.configurationService.configurationDone).toEqual(true);
    });

    describe("tests for the difficulty", () => {

        it("should set grid difficulty to Easy on click", () => {
            component.makeEasyGrid();
            expect(component.configurationService.difficulty).toEqual(Difficulty.Easy);
        });

        it("should set grid difficulty to Medium on click", () => {
            component.makeMediumGrid();
            expect(component.configurationService.difficulty).toEqual(Difficulty.Medium);
        });

        it("should set grid difficulty to Hard on click", () => {
            component.makeHardGrid();
            expect(component.configurationService.difficulty).toEqual(Difficulty.Hard);
        });

    });

    describe("socket.io tests", () => {
        it("should connect to server when it is a two player game", () => {
            component.setGameType(true);
            expect(component.multiplayerCommunicationService.isSocketDefined).toBeTruthy();
        });

        it("should have created a room and subscribed to it's messages", () => {
            component.configurationService.difficulty = Difficulty.Easy;
            component.createRoom("player");
            expect(component["_hasSubscribed"]).toBeTruthy();
        });

        it("should setup a join game", () => {
            component.setJoinGame();
            expect(component.isJoinGame).toBeTruthy();
            expect(component.configurationService.isTwoPlayerGame).toBeTruthy();
            expect(component.multiplayerCommunicationService.isSocketDefined).toBeTruthy();
            expect(component["_hasSubscribed"]).toBeTruthy();
        });
    });

    it("game only starts when other player has joined", () => {
        component.setJoinGame();
        expect(component.configurationService.grid).toBeUndefined();
    });

    it("game only starts when other player has joined", () => {
        component.setJoinGame();
        component.configurationService.configurationDone = true;
        expect(component.configurationService.configurationDone).toEqual(true);
    });

    it("show loader when looking for other player", () => {
        component.setGameType(true);
        component.waitingForRoom = true;
        expect(component.waitingForRoom).toEqual(true);
    });

    it("When both players has join and grid is generated, the game can start", () => {
        component.submitName("Player1");
        component.submitName("Player2");
        expect(component.configurationService.configurationDone).toEqual(true);
    });
});
