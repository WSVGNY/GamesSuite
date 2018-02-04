import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { GridBox } from "../../../common/crossword/gridBox";
import { Word } from "../../../common/crossword/word";
import { Vec2 } from "../../../common/crossword/vec2";
import { Char } from "../../../common/crossword/char";
import * as requestPromise from "request-promise-native";
import { Difficulty } from "../../../common/crossword/difficulty";
import { ResponseWordFromAPI } from "../../../common/communication/responseWordFromAPI";
import { WordConstraint } from "./wordConstraint";
// import { listenerCount } from "cluster";

@injectable()
export class Grid {

    public readonly SIZE_GRID_X: number = 10;
    public readonly SIZE_GRID_Y: number = 10;
    public readonly NUMBER_OF_TILES: number = this.SIZE_GRID_X * this.SIZE_GRID_Y;
    public readonly BLACK_TILES_RATIO: number = 0.5;
    public readonly NUM_BLACK_TILES: number = this.NUMBER_OF_TILES * this.BLACK_TILES_RATIO;
    public readonly MIN_WORD_LENGTH: number = 2;
    private grid: GridBox[][];
    private charGrid: Char[][];
    private words: Word[];
    private wordId: number;
    private wordDefID: number;
    private readonly URL_WORD_API: string = "http://localhost:3000/lexicon/constraints/";

    public gridCreate(req: Request, res: Response, next: NextFunction): void {
        this.newGrid().then((result: boolean) => res.send(this.grid));

    }

    private async newGrid(): Promise<boolean> {
        const isValidGrid: boolean = false;
        while (!isValidGrid) {
            this.grid = new Array<Array<GridBox>>();
            for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
                const row: GridBox[] = new Array<GridBox>();
                for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                    row.push(new GridBox(new Vec2(j, i), false));
                }
                this.grid.push(row);
            }
            if (this.placeBlackGridTiles()) {
                break;
            }
        }

        await this.wordFillControler();

        return true;
    }

    private placeBlackGridTiles(): boolean {
        // fill array 0->numberOfTile
        const array: Vec2[] = this.fillShuffledArray();
        for (let i: number = 0; i < this.NUM_BLACK_TILES; i++) {
            const randomTileId: Vec2 = array[i];
            this.findMatchingTileById(randomTileId).$black = true;
        }
        if (!this.verifyBlackGridValidity()) {
            return false;
        }

        return true;
    }

    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    private fillShuffledArray(): Array<Vec2> {
        const array: Array<Vec2> = [];
        let arrayIndex: number = 0;
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                array[arrayIndex++] = new Vec2(j, i);
            }
        }

        // shuffle array
        for (let i: number = array.length - 1; i > 0; i--) {
            const j: number = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    private findMatchingTileById(id: Vec2): GridBox {
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                if (this.grid[i][j].$id.equals(id)) {
                    return this.grid[i][j];
                }
            }
        }
        throw new Error("GridTile not found");
    }

    // returns false if there's a word of 1 letter
    private verifyBlackGridValidity(): boolean {
        this.wordId = 1;
        this.wordDefID = 1;
        this.words = [];
        let isValid: boolean = this.createWordsInGridHorizontally();
        if (isValid) {
            isValid = this.createWordsInGridVertically();
        }

        return isValid;
    }

    private createWordsInGridHorizontally(): boolean {
        let wordCnt: number = 0;
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                if (!this.grid[i][j].$black) {
                    let wordLength: number = 1;
                    while (j + wordLength < this.SIZE_GRID_X && !this.grid[i][j + wordLength].$black) {
                        wordLength++;
                    }
                    if (wordLength < this.MIN_WORD_LENGTH) {
                        if (!this.verifyVertically(i, j)) {
                            return false;
                        }
                    } else {
                        this.words[this.wordId - 1] =
                            new Word(this.wordId++, this.wordDefID++, true, wordLength, this.grid[i][j].$id);
                        j += wordLength;
                        wordCnt++;
                    }
                }
            }
            if (wordCnt < 1) {
                return false;
            }
            wordCnt = 0;
        }

        return true;
    }

    private verifyVertically(i: number, j: number): boolean {
        if (i + 1 < this.SIZE_GRID_Y) {
            return !this.grid[i + 1][j].$black;
        }
        if (i - 1 > 0) {
            return !this.grid[i - 1][j].$black;
        }

        return false;
    }

    private createWordsInGridVertically(): boolean {
        let wordCnt: number = 0;
        for (let i: number = 0; i < this.SIZE_GRID_X; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_Y; j++) {
                if (this.grid[j][i].$black) {
                    continue;
                }
                let wordLength: number = 1;
                while (j + wordLength < this.SIZE_GRID_Y && !this.grid[j + wordLength][i].$black) {
                    wordLength++;
                }
                if (wordLength >= this.MIN_WORD_LENGTH) {
                    this.words[this.wordId - 1] =
                        new Word(this.wordId++, this.findHorizontalWordDefID(i, j), false, wordLength, this.grid[j][i].$id);
                    j += wordLength;
                    wordCnt++;
                }
            }
            if (wordCnt < 1) {
                return false;
            }
            wordCnt = 0;
        }

        return true;
    }

    private findHorizontalWordDefID(i: number, j: number): number {
        for (const word of this.words) {
            if (word.$startPos.$x === i && word.$startPos.$y === j) {
                return word.$definitionID;
            }
        }

        return this.wordDefID++;
    }

    private async wordFillControler(): Promise<boolean> {
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
        let nmbrBackTrack: number = 1;
        let backTrackStartedOn: number = 0;
        for (let i: number = 0; i < this.words.length; i++) {
            const word: Word = this.words[i];
            const wordConstraints: string = new WordConstraint(word, this.charGrid).$value;
            await this.getWordFromAPI(wordConstraints, Difficulty.easy).then(
                (result: ResponseWordFromAPI) => {
                    word.$word = result.$word;
                    console.log(word.$word + ", " + word.$startPos.$x + "," + word.$startPos.$y);
                    if (word.$word === "") {
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
                    this.updateCharGrid(word);
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

    private async getWordFromAPI(constraints: string, difficulty: Difficulty): Promise<ResponseWordFromAPI> {
        const responseWord: ResponseWordFromAPI = new ResponseWordFromAPI();
        await requestPromise(this.URL_WORD_API + constraints + "/" + difficulty).then(
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

    private bindCharToGrid(): void {
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                this.grid[i][j].$value = this.charGrid[i][j].$value;
            }
        }
    }

}
