import "reflect-metadata";
import { injectable, } from "inversify";
import { GridBox } from "./gridBox";
import { Word } from "./word";
import { Char } from "./char";
import * as requestPromise from "request-promise-native";
import { Difficulty } from "../../../common/crossword/difficulty";
import { ResponseWordFromAPI } from "../../../common/communication/responseWordFromAPI";
import { WordConstraint } from "./wordConstraint";

const IS_VERTICAL: boolean = false;
const IS_HORIZONTAL: boolean = true;
const MAX_REQUEST_TRIES: number = 2;
const MAX_TRIES_TO_BACKTRACK: number = 4;

enum Token {
    Pass = 1,
    BackTrack,
    Exit
}

@injectable()
export class WordFiller {

    private readonly URL_WORD_API: string = "http://localhost:3000/lexicon/";
    private longestWord: Word;
    private filledWords: Word[];
    private backTrackCounter: number = 0;
    private backTrackingWord: Word;
    public isGenerated: boolean = false;

    public constructor(
        private SIZE_GRID_X: number,
        private SIZE_GRID_Y: number,
        private gridDifficulty: Difficulty,
        private grid: GridBox[][],
        private words: Word[]) {
    }

    public async wordFillControler(): Promise<boolean> {
        let state: Token;
        let isFull: boolean = false;
        this.createCharGrid();
        this.generateConstraints();
        this.filledWords = new Array<Word>();
        do {
            await this.fillWord(this.longestWord).then(
                (result: Token) => {
                    state = result;
                    if (state !== Token.Exit) {
                        this.longestWord = this.gridContainsIncompleteWord();
                        if (this.longestWord === undefined) {
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
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                this.grid[i][j]._isBlack ? this.grid[i][j]._char = new Char("#") : this.grid[i][j]._char = new Char("?");
            }
        }
    }

    private generateConstraints(): void {
        let maxWordLength: number = 0;
        for (const word of this.words) {
            if (word._length > maxWordLength) {
                maxWordLength = word._length;
                this.longestWord = word;
            }
            if (word._isHorizontal) {
                for (let i: number = word._startPosition._x; i < word._startPosition._x + word._length; i++) {
                    if (this.grid[word._startPosition._y][i]._difficulty > 1) {
                        word.addConstraint(this.grid[word._startPosition._y][i].getConstraint(IS_VERTICAL));
                    }
                }
            } else {
                for (let i: number = word._startPosition._y; i < word._startPosition._y + word._length; i++) {
                    if (this.grid[i][word._startPosition._x]._difficulty > 1) {
                        word.addConstraint(this.grid[i][word._startPosition._x].getConstraint(IS_HORIZONTAL));
                    }
                }
            }
        }
    }

    private async fillWord(currentWord: Word): Promise<Token> {
        let sameWordExists: Token;
        const wordConstraint: WordConstraint = new WordConstraint(currentWord, this.grid);
        const wordConstraints: string = wordConstraint.readyValue;
        await this.tryWord(wordConstraints, currentWord).then(
            (result: Token) => {
                sameWordExists = result;
            }).catch((e: Error) => console.error(e));
        if (sameWordExists === Token.BackTrack) {
            return Token.BackTrack;
        }
        let state: Token;
        for (const next of currentWord._constraints) {
            if (this.filledWords.findIndex((wordIteration: Word) => next._id === wordIteration._id) === -1) {
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
                    if (this.verifyWordAlreadyThere(result._word) || result._word === "") {
                        state = Token.BackTrack;
                    }
                    if (state === Token.Pass) {
                        if (this.backTrackingWord !== undefined && this.backTrackingWord === word) {
                            this.backTrackCounter = 0;
                            this.backTrackingWord = undefined;
                        }

                        word._value = result._word;
                        word._definition = result._definition;
                        this.updateCharGrid(word);
                        this.filledWords.push(word);
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
            currentWord._value = wordConstraint.originalValue;
            this.updateCharGrid(currentWord);
            const index: number = this.filledWords.findIndex((wordIteration: Word) => currentWord._id === wordIteration._id);
            this.filledWords.splice(index, 1);
            this.backTrackCounter++;
            this.backTrackingWord = next;
            if (this.backTrackCounter >= MAX_TRIES_TO_BACKTRACK) {
                this.backTrackCounter = 0;

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
        for (const verifWord of this.words) {
            if (verifWord._definition !== "" && verifWord._value === wordToVerify) {
                return true;
            }
        }

        return false;
    }

    private updateCharGrid(word: Word): void {
        const splitWord: string[] = Array.from(word._value);
        for (let i: number = 0; i < splitWord.length; ++i) {
            if (word._isHorizontal) {
                this.grid[word._startPosition._y][word._startPosition._x + i]._char.value = splitWord[i];
            } else {
                this.grid[word._startPosition._y + i][word._startPosition._x]._char.value = splitWord[i];
            }
        }
    }

    private async getWordFromAPI(constraints: string): Promise<ResponseWordFromAPI> {
        const responseWord: ResponseWordFromAPI = new ResponseWordFromAPI();
        await requestPromise(this.URL_WORD_API + constraints + "/" + this.gridDifficulty).then(
            (result: string) => {
                result = JSON.parse(result);
                responseWord._word = result["_word"];
                responseWord._definition = result["_definition"];
            }
        ).catch((e: Error) => {
            console.error(e);
        });

        return responseWord;
    }

    private gridContainsIncompleteWord(): Word {
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                if (this.grid[i][j]._char._value === "?") {
                    return this.grid[i][j]._constraints[0];
                }
            }
        }

        return undefined;
    }
}
