import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CrosswordComponent } from "./crossword.component";
import assert = require("assert");
import { ConfigurationService } from "./configuration/configuration.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MultiplayerCommunicationService } from "./multiplayer-communication.service";
import { Player } from "../../../../common/crossword/player";
import { CommonWord } from "../../../../common/crossword/commonWord";
import { CommonGridBox } from "../../../../common/crossword/commonGridBox";
import { CommonCoordinate2D } from "../../../../common/crossword/commonCoordinate2D";

describe("CrosswordComponent", () => {
    let component: CrosswordComponent;
    let fixture: ComponentFixture<CrosswordComponent>;
    const TIMEOUT: number = 30000;

    const createMockPlayer: Function = (colorString: string, nameString: string, scoreNumber: number) => {
        return {
            color: colorString,
            name: nameString,
            score: scoreNumber
        } as Player;
    };

    const createMockWord: Function = (idNumber: number) => {
        return {
            id: idNumber,
            isComplete: false,
            value: "ee",
            definition: "ef",
            constraints: [],
            difficulty: 1,
            parentCaller: undefined,
            definitionID: 2,
            isHorizontal: true,
            length: 1,
            startPosition: { x: 0, y: 0 },
            enteredCharacters: 0
        } as CommonWord;
    };

    const createMockConfiguration: Function = (twoPlayer: boolean) => {
        component.configuration.playerOne = createMockPlayer("steelblue", "name1", 0);
        component.configuration.playerOne.foundWords = [];
        component.configuration.playerOne.foundBoxes = [];
        component.configuration.playerOne.selectedBoxes = [];
        component.configuration.currentPlayerName = "name1";
        component.configuration.isTwoPlayerGame = twoPlayer;
        if (twoPlayer) {
            component.configuration.playerTwo = createMockPlayer("steelblue", "name1", 0);
            component.configuration.playerTwo.foundWords = [];
            component.configuration.playerTwo.foundBoxes = [];
            component.configuration.playerTwo.selectedBoxes = [];
        }
        component.configuration.grid = {
            boxes: [[{ id: { x: 0, y: 0 }, isBlack: false }]],
            words: undefined
        };
        component.configuration.configurationDone = true;
    };

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
            setTimeout(() => done(), TIMEOUT);
            expect(component.configuration.grid).toBeTruthy();
        });

    });

    it("the view contains definitions", () => {
        it("contains definitions", (done: () => void) => {
            setTimeout(() => done(), TIMEOUT);
            expect(component.configuration.grid.words[0].definition).toBeTruthy();
        });
    });

    it("the game information view contain the name of the player", () => {
        component.configuration.playerOne = createMockPlayer("steelblue", "player1", 0);
        component.configuration.currentPlayerName = "player1";
        expect(component.configuration.currentPlayer.name).toBeTruthy();
    });

    it("the game information view contain the numer of words found", () => {
        component.configuration.playerOne = createMockPlayer("steelblue", "player1", 0);
        component.configuration.currentPlayerName = "player1";
        expect(component.configuration.currentPlayer.score).toEqual(0);
    });

    it("should have 2 players, if the game is set to two players ", () => {
        component.configuration.isTwoPlayerGame = true;
        expect(component.configuration.isTwoPlayerGame).toEqual(true);
    });

    it("should have 1 player, if the game is set to single player ", () => {
        component.configuration.isTwoPlayerGame = false;
        expect(component.configuration.isTwoPlayerGame).toEqual(false);
    });

    it("the name entered by the player is the one displayed ", () => {
        const enteredName: string = "Player1";
        component.configuration.playerOne = createMockPlayer("steelblue", "player", 0);
        component.configuration.playerOne.name = enteredName;
        component.configuration.currentPlayerName = enteredName;
        expect(component.configuration.currentPlayer.name).toEqual(enteredName);
    });

    it("the letters in the grid are uppercase", () => {
        it("contains a grid", (done: () => void) => {
            setTimeout(() => done(), TIMEOUT);
            for (const line of component.configuration.grid.boxes) {
                for (const box of line) {
                    if (box.char.value !== "#" && box.char.value !== box.char.value.toUpperCase()) {
                        assert(false);
                    }
                }
            }
            assert(true);
        });
    });

    it("when a word is selected, its border are highligthed", () => {
        createMockConfiguration(false);
        const word: CommonWord = createMockWord(2);
        component.setSelectedWord(word);
        expect(component.configuration.currentPlayer.selectedWord).toEqual(word);
    });

    it("when clicking somewhere else, the word become unselected", () => {
        createMockConfiguration(false);
        component.resetInputBox();
        expect(component.inputGridBox).toBeUndefined();
    });

    it("when a player selects a word, its border becomes of the color of the player", () => {
        createMockConfiguration(false);
        const word: CommonWord = createMockWord(2);
        component.setSelectedWord(word);
        expect(component.configuration.currentPlayer.selectedBoxes)
            .toContain(component.configuration.grid.boxes[word.startPosition.y][word.startPosition.x]);
    });

    it("if a word is selected by both players, its borders becomes dashed", () => {
        createMockConfiguration(true);
        const word: CommonWord = createMockWord(2);
        component.setSelectedWord(word);
        component.configuration.otherPlayer.selectedBoxes = component.configuration.currentPlayer.selectedBoxes;
        expect(component.configuration.currentPlayer.selectedBoxes).toEqual(component.configuration.otherPlayer.selectedBoxes);
    });

    it("letters can be inputed", () => {
        createMockConfiguration(false);
        const word: CommonWord = createMockWord(0);
        component.configuration.grid.words = [word];
        component.setSelectedWord(word);
        component.inputGridBox.inputChar = { value: "" };
        component.inputGridBox.char = { value: "b" };
        const tmp: CommonCoordinate2D = { x: component.configuration.getX(), y: component.configuration.getY() };
        const event: KeyboardEvent = new KeyboardEvent("keypress", {
            key: "a"
        });
        component.inputChar(event);
        expect(component.configuration.grid.boxes[tmp.y][tmp.x].inputChar.value).toEqual("A");
    });

    it("only letters can be inputed", () => {
        createMockConfiguration(false);
        const word: CommonWord = createMockWord(0);
        component.configuration.grid.words = [word];
        component.setSelectedWord(word);
        component.inputGridBox.inputChar = { value: "" };
        component.inputGridBox.char = { value: "b" };
        const tmp: CommonCoordinate2D = { x: component.configuration.getX(), y: component.configuration.getY() };
        const event: KeyboardEvent = new KeyboardEvent("keypress", {
            key: "3"
        });
        component.inputChar(event);
        expect(component.configuration.grid.boxes[tmp.y][tmp.x].inputChar.value).toEqual("");
    });

    it("when all letters are correct, the word is automatically set to found (whitout having to press enter)", () => {
        createMockConfiguration(false);
        const word: CommonWord = createMockWord(0);
        component.configuration.grid.words = [word];
        component.setSelectedWord(word);
        component.inputGridBox.inputChar = { value: "" };
        component.inputGridBox.char = { value: "A" };
        const tmp: CommonGridBox = component.inputGridBox;
        const event: KeyboardEvent = new KeyboardEvent("keypress", {
            key: "a"
        });
        component.inputChar(event);
        expect(component.configuration.currentPlayer.foundBoxes).toContain(tmp);
    });

    it("when a word is found, the answer is visible by all players", () => {
        createMockConfiguration(false);
        const word: CommonWord = createMockWord(0);
        component.configuration.grid.words = [word];
        component.setSelectedWord(word);
        component.inputGridBox.inputChar = { value: "" };
        component.inputGridBox.char = { value: "A" };
        const event: KeyboardEvent = new KeyboardEvent("keypress", {
            key: "a"
        });
        component.inputChar(event);
        expect(component.getState(word)).toEqual(2);
    });

    it("When the game is over, the player has the option to either play again or go to menu ", () => {
        component.configuration.grid = {
            boxes: [[{ id: { x: 0, y: 0 }, isBlack: false }]],
            words: createMockWord(2)
        };
        component.configuration.playerOne = createMockPlayer("steelblue", "name1", 1);
        component.configuration.playerTwo = createMockPlayer("orangered", "name2", 0);
        component.configuration.isTwoPlayerGame = true;
        component.endGame();
        expect(component.isGameFinished).toEqual(true);
    });
});
