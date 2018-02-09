import "reflect-metadata";
import { injectable, } from "inversify";
import { GridBox } from "../../../common/crossword/gridBox";
import { Word } from "../../../common/crossword/word";
import { Char } from "../../../common/crossword/char";
import * as requestPromise from "request-promise-native";
import { Difficulty } from "../../../common/crossword/difficulty";
import { ResponseWordFromAPI } from "../../../common/communication/responseWordFromAPI";
import { WordConstraint } from "./wordConstraint";

const VERTICAL: boolean = false;
const HORIZONTAL: boolean = true;
const MAX_REQUEST_TRIES: number = 2;

@injectable()
export class WordFiller {

    private readonly URL_WORD_API: string = "http://localhost:3000/lexicon/";
    private readonly gridDifficulty: Difficulty = Difficulty.easy;
    private longestWord: Word;
    private filledWords: Word[];

    public constructor(
        private SIZE_GRID_X: number,
        private SIZE_GRID_Y: number,
        private grid: GridBox[][],
        private words: Word[]) {
    }

    public async wordFillControler(): Promise<boolean> {
        let isFull: boolean = false;
        do {
            this.createCharGrid();
            this.generateConstraints();
            this.filledWords = new Array<Word>();
            console.log("RESTART");
            await this.fillWord(this.longestWord).then(
                (result: boolean) => {
                    this.longestWord = this.gridContainsIncompleteWord();
                    if (this.longestWord === undefined) {
                        isFull = true;
                    }
                }).catch((e: Error) => console.error(e));
        } while (!isFull);

        return true;
    }

    private createCharGrid(): void {
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                this.grid[i][j].$black ? this.grid[i][j].$char = new Char("#") : this.grid[i][j].$char = new Char("?");
            }
        }
    }

    private generateConstraints(): void {
        let maxWordLength: number = 0;
        for (const word of this.words) {
            if (word.$length > maxWordLength) {
                maxWordLength = word.$length;
                this.longestWord = word;
            }
            if (word.$horizontal) {
                for (let i: number = word.$startPosition.$x; i < word.$startPosition.$x + word.$length; i++) {
                    if (this.grid[word.$startPosition.$y][i].$difficulty > 1) {
                        word.addConstraint(this.grid[word.$startPosition.$y][i].getConstraint(VERTICAL));
                    }
                }
            } else {
                for (let i: number = word.$startPosition.$y; i < word.$startPosition.$y + word.$length; i++) {
                    if (this.grid[i][word.$startPosition.$x].$difficulty > 1) {
                        word.addConstraint(this.grid[i][word.$startPosition.$x].getConstraint(HORIZONTAL));
                    }
                }
            }
        }
    }

    // tslint:disable-next-line:max-func-body-length
    private async fillWord(word: Word): Promise<boolean> {
        console.log();
        let sameWordExists: boolean = false;
        const wordConstraint: WordConstraint = new WordConstraint(word, this.grid);
        const wordConstraints: string = wordConstraint.$readyValue;
        console.log("ID : " + word.$id);
        for (let i: number = 0; i < MAX_REQUEST_TRIES; i++) {
            sameWordExists = false;
            await this.getWordFromAPI(wordConstraints).then(
                (result: ResponseWordFromAPI) => {
                    console.log("Resulted Word : " + result.$word);
                    if (this.verifyWordAlreadyThere(result.$word) || result.$word === "") {
                        sameWordExists = true;
                    }
                    if (!sameWordExists) {
                        word.$value = result.$word;
                        this.updateCharGrid(word);
                        this.filledWords.push(word);
                    }
                    console.log("Resulted ID : " + word.$id);
                }
            ).catch((e: Error) => console.error(e));
            if (!sameWordExists) {
                break;
            }
        }
        if (sameWordExists) {
            return false;
        }
        process.stdout.write("List of ID's : ");
        for (const word2 of this.filledWords) {
            process.stdout.write(word2.$id + ", ");
        }
        console.log();
        let passed: boolean = true;
        for (const next of word.$constraints) {
            console.log("Next ID : " + next.$id);
            if (this.filledWords.findIndex((wordIteration: Word) => next.$id === wordIteration.$id) === -1) {
                await this.fillWord(next).then(
                    (result: boolean) => {
                        passed = result;
                    }).catch((e: Error) => console.error(e));
                if (!passed) {
                    // break;
                    word.$value = wordConstraint.$originalValue;
                    await this.fillWord(word);
                }
            }
        }

        return passed;
    }

    private verifyWordAlreadyThere(wordToVerify: string): boolean {
        for (const verifWord of this.words) {
            if (verifWord.$definition !== "" && verifWord.$value === wordToVerify) {
                return true;
            }
        }

        return false;
    }

    private updateCharGrid(word: Word): void {
        const splitWord: string[] = Array.from(word.$value);
        for (let i: number = 0; i < splitWord.length; ++i) {
            if (word.$horizontal) {
                this.grid[word.$startPosition.$y][word.$startPosition.$x + i].$char.$value = splitWord[i];
            } else {
                this.grid[word.$startPosition.$y + i][word.$startPosition.$x].$char.$value = splitWord[i];
            }
        }
    }

    private async getWordFromAPI(constraints: string): Promise<ResponseWordFromAPI> {
        const responseWord: ResponseWordFromAPI = new ResponseWordFromAPI();
        await requestPromise(this.URL_WORD_API + constraints + "/" + this.gridDifficulty).then(
            (result: string) => {
                // console.log(result);
                result = JSON.parse(result);
                responseWord.$word = result["word"];
                responseWord.$definition = result["definition"];
            }
        ).catch((e: Error) => {
            console.error(e);
        });

        return responseWord;
    }

    private gridContainsIncompleteWord(): Word {
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                if (this.grid[i][j].$char.$value === "?") {
                    return this.grid[i][j].getWord();
                }
            }
        }

        return undefined;
    }
}
