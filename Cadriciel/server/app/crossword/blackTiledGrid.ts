import "reflect-metadata";
import { injectable, } from "inversify";
import { GridBox } from "../../../common/crossword/gridBox";
import { Word } from "../../../common/crossword/word";
import { Vec2 } from "../../../common/crossword/vec2";

@injectable()
export class BlackTiledGrid {

    public readonly BLACK_TILES_RATIO: number = 0.45;
    public readonly NUMBER_OF_TILES: number = this.SIZE_GRID_X * this.SIZE_GRID_Y;
    public readonly NUM_BLACK_TILES: number = this.NUMBER_OF_TILES * this.BLACK_TILES_RATIO;
    public readonly MIN_WORD_LENGTH: number = 2;

    private wordId: number;
    private wordDefID: number;
    private words: Word[];

    public get $words(): Word[] {
        return this.words;
    }

    public constructor(private SIZE_GRID_X: number, private SIZE_GRID_Y: number,
                       private grid: GridBox[][]) {
                       this.words = this.placeBlackGridTiles();
    }

    public placeBlackGridTiles(): Word[] {
        const array: Vec2[] = this.createShuffledArray();
        for (let i: number = 0; i < this.NUM_BLACK_TILES; i++) {
            const randomTileId: Vec2 = array[i];
            this.findMatchingTileById(randomTileId).$black = true;
        }
        if (this.verifyBlackGridValidity()) {
            return this.words;
        } else {
            return undefined;
        }
    }

    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    private createShuffledArray(): Array<Vec2> {
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
    // Horizontal must be called first because it verifies that 1 letter word are at least of 2 letters vertically
    // Vertical executes with the assumption that this verification has been made.
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
                if (this.grid[i][j].$black) {
                    continue;
                }
                const wordLength: number = this.calculateWordLength(true, i, j);
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
                const wordLength: number = this.calculateWordLength(false, i, j);

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

    private calculateWordLength(isHorizontal: boolean, i: number, j: number): number {
        let wordLength: number = 1;
        if (isHorizontal) {
            while (j + wordLength < this.SIZE_GRID_X && !this.grid[i][j + wordLength].$black) {
                wordLength++;
            }
        } else {
            while (j + wordLength < this.SIZE_GRID_Y && !this.grid[j + wordLength][i].$black) {
                wordLength++;
            }
        }

        return wordLength;
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
