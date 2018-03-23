import "reflect-metadata";
import { injectable, } from "inversify";
import { GridBox } from "./gridBox";
import { Word } from "./word";
import { Coordinate2D } from "./coordinate2D";
import { NUM_BLACK_TILES, MAX_DIFFICULTY, MIN_WORD_LENGTH, IS_HORIZONTAL, IS_VERTICAL, SIZE_GRID_X, SIZE_GRID_Y } from "./configuration";
import { CommonGridBox } from "../../../common/crossword/commonGridBox";

@injectable()
export class BlackTiledGrid {

    private _wordId: number;
    private _wordDefinitionID: number;
    private _words: Word[];

    public get words(): Word[] {
        return this._words;
    }

    public constructor(
        private _grid: GridBox[][]) {
        this._wordId = 0;
        this._words = this.placeBlackGridTiles();
    }

    public placeBlackGridTiles(): Word[] {
        const array: Coordinate2D[] = this.createShuffledArray();
        for (let i: number = 0; i < NUM_BLACK_TILES; i++) {
            const randomTileId: Coordinate2D = array[i];
            this.findMatchingTileById(randomTileId).isBlack = true;
        }
        if (this.verifyBlackGridValidity()) {
            const totalDifficulty: number = this.calculateGridDifficulty();
            if (totalDifficulty < MAX_DIFFICULTY) {
                return this.words;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    private calculateGridDifficulty(): number {
        let totalDifficulty: number = 0;
        for (const row of this._grid) {
            for (const box of row) {
                totalDifficulty += box.difficulty;
            }
        }
        let maxWordLength: number = 0;
        let minLengthWordQuantity: number = 0;
        for (const word of this.words) {
            if (word.length > maxWordLength) {
                maxWordLength = word.length;
            }
            if (word.length === MIN_WORD_LENGTH) {
                minLengthWordQuantity++;
            }
        }
        totalDifficulty += SIZE_GRID_X - maxWordLength + minLengthWordQuantity;

        return totalDifficulty;
    }

    private createShuffledArray(): Array<Coordinate2D> {
        const array: Array<Coordinate2D> = [];
        let arrayIndex: number = 0;
        for (let i: number = 0; i < SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < SIZE_GRID_X; j++) {
                array[arrayIndex++] = new Coordinate2D(j, i);
            }
        }

        for (let i: number = array.length - 1; i > 0; i--) {
            const j: number = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    private findMatchingTileById(id: Coordinate2D): CommonGridBox {
        for (let i: number = 0; i < SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < SIZE_GRID_X; j++) {
                if (this._grid[i][j].id.equals(id)) {
                    return this._grid[i][j];
                }
            }
        }
        throw new ReferenceError("GridTile not found");
    }

    private verifyBlackGridValidity(): boolean {
        this._wordId = 1;
        this._wordDefinitionID = 1;
        this._words = [];
        let isValid: boolean = this.createWordsInGridHorizontally();
        if (isValid) {
            isValid = this.createWordsInGridVertically();
        }

        return isValid;
    }

    private createWordsInGridHorizontally(): boolean {
        let wordCount: number = 0;
        for (let i: number = 0; i < SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < SIZE_GRID_X; j++) {
                if (this._grid[i][j].isBlack) {
                    continue;
                }
                const wordLength: number = this.calculateWordLength(IS_HORIZONTAL, i, j);
                if (wordLength < MIN_WORD_LENGTH) {
                    if (!this.verifyVertically(i, j)) {
                        return false;
                    }
                } else {
                    this.words[this._wordId - 1] =
                        new Word(this._wordId, this._wordDefinitionID++, IS_HORIZONTAL, wordLength, this._grid[i][j].id);
                    for (let k: number = j; k < j + wordLength; k++) {
                        this._grid[i][k].addConstraint(this.words[this._wordId - 1]);
                    }
                    j += wordLength; wordCount++; this._wordId++;
                }
            }
            if (wordCount < 1) {
                return false;
            }
            wordCount = 0;
        }

        return true;
    }

    private verifyVertically(i: number, j: number): boolean {
        if (i + 1 < SIZE_GRID_Y) {
            return !this._grid[i + 1][j].isBlack;
        }
        if (i - 1 > 0) {
            return !this._grid[i - 1][j].isBlack;
        }

        return false;
    }

    private createWordsInGridVertically(): boolean {
        let wordCount: number = 0;
        for (let i: number = 0; i < SIZE_GRID_X; i++) {
            for (let j: number = 0; j < SIZE_GRID_Y; j++) {
                if (this._grid[j][i].isBlack) {
                    continue;
                }
                const wordLength: number = this.calculateWordLength(IS_VERTICAL, i, j);

                if (wordLength >= MIN_WORD_LENGTH) {
                    this.words[this._wordId - 1] =
                        new Word(this._wordId, this.findHorizontalWordDefID(i, j), IS_VERTICAL, wordLength, this._grid[j][i].id);
                    for (let k: number = j; k < j + wordLength; k++) {
                        this._grid[k][i].addConstraint(this.words[this._wordId - 1]);
                    }
                    j += wordLength; wordCount++; this._wordId++;
                }
            }
            if (wordCount < 1) {
                return false;
            }
            wordCount = 0;
        }

        return true;
    }

    private calculateWordLength(isHorizontal: boolean, i: number, j: number): number {
        let wordLength: number = 1;
        if (isHorizontal) {
            while (j + wordLength < SIZE_GRID_X && !this._grid[i][j + wordLength].isBlack) {
                wordLength++;
            }
        } else {
            while (j + wordLength < SIZE_GRID_Y && !this._grid[j + wordLength][i].isBlack) {
                wordLength++;
            }
        }

        return wordLength;
    }

    private findHorizontalWordDefID(i: number, j: number): number {
        for (const word of this.words) {
            if (word.startPosition.x === i && word.startPosition.y === j) {
                return word.definitionID;
            }
        }

        return this._wordDefinitionID++;
    }
}
