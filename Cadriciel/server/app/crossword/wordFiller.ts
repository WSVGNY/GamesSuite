import "reflect-metadata";
import { injectable, } from "inversify";
import { GridBox } from "../../../common/crossword/gridBox";
import { Word } from "../../../common/crossword/word";
// import { Vec2 } from "../../../common/crossword/vec2";
import { Char } from "../../../common/crossword/char";
import * as requestPromise from "request-promise-native";
import { Difficulty } from "../../../common/crossword/difficulty";
import { ResponseWordFromAPI } from "../../../common/communication/responseWordFromAPI";
import { WordConstraint } from "./wordConstraint";

@injectable()
export class WordFiller {

    private charGrid: Char[][];
    private readonly URL_WORD_API: string = "http://localhost:3000/lexicon/";
    private readonly gridDifficulty: Difficulty = Difficulty.easy;

    public constructor(
        private SIZE_GRID_X: number,
        private SIZE_GRID_Y: number,
        private grid: GridBox[][],
        private words: Word[]) {
    }

    public async wordFillControler(): Promise<boolean> {
        this.createCharGrid();
        this.sortWordsList();
        await this.fillWords().then(
            (result: boolean) => {
                this.bindCharToGrid();
            }).catch((e: Error) => console.error(e));

        return true;
    }

    private createCharGrid(): void {
        this.charGrid = new Array<Array<Char>>();
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            const row: Char[] = new Array<Char>();

            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                if (this.grid[i][j].$black === false) {
                    row.push(new Char("?"));
                } else {
                    row.push(new Char("#"));
                }
            }
            this.charGrid.push(row);
        }
    }

    private sortWordsList(): void {
        if (this.words !== undefined) {
            this.words.sort((a: Word, b: Word) => b.$length - a.$length);
        }
    }

    private async fillWords(): Promise<boolean> {
        const nmbrBackTrack: number = 1;
        const backTrackStartedOn: number = 0;
        for (let i: number = 0; i < this.words.length; i++) {
            const word: Word = this.words[i];
            const wordConstraints: string = new WordConstraint(word, this.charGrid).$value;
            await this.getWordFromAPI(wordConstraints).then(
                (result: ResponseWordFromAPI) => {
                    word.$word = result.$word;
                    if (word.$word === "") {
                        this.backTrack(word, i, nmbrBackTrack, backTrackStartedOn);
                    } else {
                        this.updateCharGrid(word);
                    }
                }
            ).catch((e: Error) => console.error(e));
        }

        return true;
    }

    private updateCharGrid(word: Word): void {
        const splittedWord: string[] = Array.from(word.$word);
        for (let i: number = 0; i < splittedWord.length; ++i) {
            if (word.$horizontal) {
                this.charGrid[word.$startPos.$y][word.$startPos.$x + i].$value = splittedWord[i];
            } else {
                this.charGrid[word.$startPos.$y + i][word.$startPos.$x].$value = splittedWord[i];
            }
        }
    }

    private async getWordFromAPI(constraints: string): Promise<ResponseWordFromAPI> {
        const responseWord: ResponseWordFromAPI = new ResponseWordFromAPI();
        await requestPromise(this.URL_WORD_API + constraints + "/" + this.gridDifficulty).then(
            (result: string) => {
                result = JSON.parse(result);
                responseWord.$word = result["word"];
                responseWord.$definition = result["definition"];
            }
        ).catch((e: Error) => {
            // console.error(e);
        });

        return responseWord;
    }

    private backTrack(word: Word, i: number, backTrackStartedOn: number, nmbrBackTrack: number): void {
        backTrackStartedOn = i;
        for (let j: number = i; j > i - nmbrBackTrack; j--) {
            this.words[j].resetValue();
        }
        i -= nmbrBackTrack;
        for (let j: number = i; j < i + nmbrBackTrack; j++) {
            this.updateCharGrid(this.words[j]);
        }
        if (i === 0 || i === backTrackStartedOn) {
            nmbrBackTrack = 0;
            backTrackStartedOn = 0;
        }
        nmbrBackTrack++;
    }

    private bindCharToGrid(): void {
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                this.grid[i][j].$value = this.charGrid[i][j].$value;
            }
        }
    }
}
