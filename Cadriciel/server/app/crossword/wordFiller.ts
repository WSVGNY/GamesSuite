import "reflect-metadata";
import { injectable, } from "inversify";
import { GridBox } from "../../../common/crossword/gridBox";
import { Word } from "../../../common/crossword/word";
import { Char } from "../../../common/crossword/char";
import * as requestPromise from "request-promise-native";
import { Difficulty } from "../../../common/crossword/difficulty";
import { ResponseWordFromAPI } from "../../../common/communication/responseWordFromAPI";
import { WordConstraint } from "./wordConstraint";

@injectable()
export class WordFiller {

    private readonly URL_WORD_API: string = "http://localhost:3000/lexicon/";
    private readonly gridDifficulty: Difficulty = Difficulty.easy;
    private readonly MAX_REQUEST_TRIES: number = 3;

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
            this.sortWords();
            await this.fillWords().then(
                (result: boolean) => {
                    isFull = !this.gridContainsIncompleteWord();
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

    private sortWords(): void {
        if (this.words !== undefined) {
            this.words.sort((a: Word, b: Word) => b.$length - a.$length);
        }
    }

    private async fillWords(): Promise<boolean> {
        for (const word of this.words) {
            let sameWordExists: boolean = false;
            let numTry: number = 0;
            const wordConstraints: string = new WordConstraint(word, this.grid).$value;
            do {
                sameWordExists = false;
                await this.getWordFromAPI(wordConstraints).then(
                    (result: ResponseWordFromAPI) => {
                        if (this.verifyWordAlreadyThere(result.$word)) {
                            sameWordExists = true;
                            numTry++;
                        }

                        if (!sameWordExists) {
                            numTry = 0;
                            word.$value = result.$word;
                            this.updateCharGrid(word);
                        }
                    }
                ).catch((e: Error) => console.error(e));
            } while (sameWordExists && numTry < this.MAX_REQUEST_TRIES);
        }

        return true;
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

    private gridContainsIncompleteWord(): boolean {
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                if (this.grid[i][j].$char.$value === "?") {
                    return true;
                }
            }
        }

        return false;
    }
}
