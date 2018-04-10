import "reflect-metadata";
import { injectable, } from "inversify";
import { GridBox } from "./gridBox";
import { Word } from "./word";
import { Char } from "./char";
import * as requestPromise from "request-promise-native";
import { Difficulty } from "../../../common/crossword/difficulty";
import { ResponseWordFromAPI } from "../../../common/communication/responseWordFromAPI";
import { WordConstraint } from "./wordConstraint";
import { IS_HORIZONTAL, IS_VERTICAL, URL_WORD_API, SIZE_GRID_X, SIZE_GRID_Y } from "./configuration";

const MAX_REQUEST_TRIES: number = 2;
const MAX_TRIES_TO_BACKTRACK: number = 4;

enum Token {
    Pass = 1,
    BackTrack,
    Exit
}

@injectable()
export class WordFiller {

    private _longestWord: Word;
    private _filledWords: Word[];
    private _backTrackCounter: number;
    private _backTrackingWord: Word;
    public isGenerated: boolean;

    public constructor(
        private _gridDifficulty: Difficulty,
        private _grid: GridBox[][],
        private _words: Word[]) {
        this._backTrackCounter = 0;
        this.isGenerated = false;
    }

    public async wordFillControler(): Promise<boolean> {
        let state: Token;
        let isFull: boolean = false;
        this.createCharGrid();
        this.generateConstraints();
        this._filledWords = [];
        do {
            await this.fillWord(this._longestWord).then(
                (result: Token) => {
                    state = result;
                    if (state !== Token.Exit) {
                        this._longestWord = this.gridContainsIncompleteWord();
                        if (this._longestWord === undefined) {
                            isFull = true;
                        }
                    }
                }).catch((e: Error) => console.error(e));
        } while (!isFull && state !== Token.Exit);
        if (state === Token.Exit) {
            return false;
        }
        this.isGenerated = true;

        return true;
    }

    private createCharGrid(): void {
        for (let i: number = 0; i < SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < SIZE_GRID_X; j++) {
                this._grid[i][j].char = new Char;
                this._grid[i][j].isBlack ? this._grid[i][j].char.setValue("#") : this._grid[i][j].char.setValue("?");
            }
        }
    }

    private generateConstraints(): void {
        let maxWordLength: number = 0;
        for (const word of this._words) {
            if (word.length > maxWordLength) {
                maxWordLength = word.length;
                this._longestWord = word;
            }
            if (word.isHorizontal) {
                for (let i: number = word.startPosition.x; i < word.startPosition.x + word.length; i++) {
                    if (this._grid[word.startPosition.y][i].difficulty > 1) {
                        word.addConstraint(this._grid[word.startPosition.y][i].getConstraint(IS_VERTICAL));
                    }
                }
            } else {
                for (let i: number = word.startPosition.y; i < word.startPosition.y + word.length; i++) {
                    if (this._grid[i][word.startPosition.x].difficulty > 1) {
                        word.addConstraint(this._grid[i][word.startPosition.x].getConstraint(IS_HORIZONTAL));
                    }
                }
            }
        }
    }

    private async fillWord(currentWord: Word): Promise<Token> {
        let sameWordExists: Token;
        const wordConstraint: WordConstraint = new WordConstraint(currentWord, this._grid);
        const wordConstraints: string = wordConstraint.readyValue;
        await this.tryWord(wordConstraints, currentWord).then(
            (result: Token) => {
                sameWordExists = result;
            }).catch((e: Error) => console.error(e));
        if (sameWordExists === Token.BackTrack) {
            return Token.BackTrack;
        }
        let state: Token;
        for (const next of currentWord.constraints) {
            if (this._filledWords.findIndex((wordIteration: Word) => next.id === wordIteration.id) === -1) {
                next.parentCaller = currentWord;
                await this.manageBackTrack(next, currentWord, wordConstraint).then(
                    (result: Token) => {
                        state = result;
                    }).catch((e: Error) => console.error(e));
                if (state === Token.Exit) {
                    break;
                }
            }
        }

        return state;
    }

    private async tryWord(wordConstraints: string, word: Word): Promise<Token> {
        let state: Token;
        for (let i: number = 0; i < MAX_REQUEST_TRIES; i++) {
            state = Token.Pass;
            await this.getWordFromAPI(wordConstraints).then(
                (result: ResponseWordFromAPI) => {
                    if (this.verifyWordAlreadyThere(result.word) || result.word === "") {
                        state = Token.BackTrack;
                    }
                    if (state === Token.Pass) {
                        if (this._backTrackingWord !== undefined && this._backTrackingWord === word) {
                            this._backTrackCounter = 0;
                            this._backTrackingWord = undefined;
                        }

                        word.value = result.word;
                        word.definition = result.definition;
                        this.updateCharGrid(word);
                        this._filledWords.push(word);
                    }
                }
            ).catch((e: Error) => console.error(e));
            if (state === Token.Pass) {
                break;
            }
        }

        return state;
    }

    private async manageBackTrack(next: Word, currentWord: Word, wordConstraint: WordConstraint): Promise<Token> {
        let state: Token;
        await this.fillWord(next).then(
            (result: Token) => {
                state = result;
            }).catch((e: Error) => console.error(e));
        if (state === Token.BackTrack) {
            currentWord.value = wordConstraint.originalValue;
            this.updateCharGrid(currentWord);
            const index: number = this._filledWords.findIndex((wordIteration: Word) => currentWord.id === wordIteration.id);
            this._filledWords.splice(index, 1);
            this._backTrackCounter++;
            this._backTrackingWord = next;
            if (this._backTrackCounter >= MAX_TRIES_TO_BACKTRACK) {
                this._backTrackCounter = 0;

                return Token.Exit;
            }
            await this.fillWord(currentWord).then(
                (result: Token) => {
                    state = result;
                }).catch((e: Error) => console.error(e));
        }

        return state;
    }

    private verifyWordAlreadyThere(wordToVerify: string): boolean {
        for (const verifWord of this._words) {
            if (verifWord.definition !== "" && verifWord.value === wordToVerify) {
                return true;
            }
        }

        return false;
    }

    private updateCharGrid(word: Word): void {
        const splitWord: string[] = Array.from(word.value);
        for (let i: number = 0; i < splitWord.length; ++i) {
            if (word.isHorizontal) {
                this._grid[word.startPosition.y][word.startPosition.x + i].char.setValue(splitWord[i]);
            } else {
                this._grid[word.startPosition.y + i][word.startPosition.x].char.setValue(splitWord[i]);
            }
        }
    }

    private async getWordFromAPI(constraints: string): Promise<ResponseWordFromAPI> {
        const responseWord: ResponseWordFromAPI = new ResponseWordFromAPI();
        await requestPromise(URL_WORD_API + constraints + "/" + this._gridDifficulty).then(
            (result: string) => {
                result = JSON.parse(result);
                responseWord.word = result["word"];
                responseWord.definition = result["definition"];
            }
        ).catch((e: Error) => {
            console.error(e);
        });

        return responseWord;
    }

    private gridContainsIncompleteWord(): Word {
        for (let i: number = 0; i < SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < SIZE_GRID_X; j++) {
                if (this._grid[i][j].char.value === "?") {
                    return this._grid[i][j].constraints[0];
                }
            }
        }

        return undefined;
    }
}
