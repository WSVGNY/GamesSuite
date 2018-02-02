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

@injectable()
export class Grid {

    private readonly SIZE_GRID_X: number = 10;
    private readonly SIZE_GRID_Y: number = 10;
    private readonly NUMBER_OF_TILES: number = this.SIZE_GRID_X * this.SIZE_GRID_Y;
    private readonly BLACK_TILES_RATIO: number = 0.4;
    private readonly NUM_BLACK_TILES: number = this.NUMBER_OF_TILES * this.BLACK_TILES_RATIO;
    private readonly MIN_WORD_LENGTH: number = 2;
    private grid: GridBox[][];
    private charGrid: Char[][];
    private words: Word[];
    private wordId: number;
    private wordDefID: number;
    private readonly URL_WORD_API: string = "http://localhost:3000/lexicon/constraints/";

    public gridCreate(req: Request, res: Response, next: NextFunction): void {
        this.newGrid();
        res.send(this.grid);
    }

    private newGrid(): void {
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

        this.wordFillControler();
    }

    private wordFillControler(): void {
        this.createCharGrid();
        this.bindCharToGrid();
        this.sortWordsList();
        this.fillWords();
    }

    private fillWords(): void {

        this.getWordFromAPI("%3f%3f%3f", Difficulty.easy).then(
            (result: ResponseWordFromAPI) => {
                console.log(result);
            }
        ).catch((e: Error) => console.error(e));
    }


    private async getWordFromAPI(constraints: string, difficulty: Difficulty): Promise<ResponseWordFromAPI> {
        let responseWord: ResponseWordFromAPI;
        await requestPromise(this.URL_WORD_API + constraints + "/" + difficulty).then(
            (result: ResponseWordFromAPI) => {
                responseWord = result;
            }
        ).catch((e: Error) => {
            console.error(e);
        });

        return responseWord;
    }
    private sortWordsList(): void {
        if (this.words !== undefined) {
            this.words.sort((a: Word, b: Word) => b.$length - a.$length);
        }
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

    private bindCharToGrid(): void {
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                this.grid[i][j].$value = this.charGrid[i][j].getValue();
            }
        }
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

    // Horizontal MUST be called first because it tests single boxes vertically
    // In vertical, it supposes that all single boxes are valid

    private createWordsInGridHorizontally(): boolean {
        let isValid: boolean = true;
        let wordCnt: number = 0;
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                if (!this.grid[i][j].$black) {
                    let wordLength: number = 1;
                    while (j + wordLength < this.SIZE_GRID_X && !this.grid[i][j + wordLength].$black) {
                        wordLength++;
                    }
                    if (wordLength < this.MIN_WORD_LENGTH) {
                        isValid = this.verifyVertically(i, j);
                        if (!isValid) {
                            return isValid;
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

        return isValid;
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

    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    private fillShuffledArray(): Array<Vec2> {
        const array: Array<Vec2> = [];
        let arrayIndex: number = 0;
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                // array[arrayIndex++] = this.grid[i][j].$id;
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
                if (this.grid[i][j].$id.$x === id.$x &&
                    this.grid[i][j].$id.$y === id.$y) {
                    return this.grid[i][j];
                }
            }
        }
        throw new Error("GridTile not found");
    }

    private findHorizontalWordDefID(i: number, j: number): number {
        for (const word of this.words) {
            if (word.$startPos.$x === i && word.$startPos.$y === j) {
                return word.$definitionID;
            }
        }

        return this.wordDefID++;
    }
}
