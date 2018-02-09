import "reflect-metadata";
import { injectable, } from "inversify";
import { GridBox } from "../../../common/crossword/gridBox";
import { Word } from "../../../common/crossword/word";
import { Vec2 } from "../../../common/crossword/vec2";

const HORIZONTAL: boolean = true;
const VERTICAL: boolean = false;
const MAX_DIFFICULTY: number = 98;
const BLACK_TILES_RATIO: number = 0.45;
const MIN_WORD_LENGTH: number = 2;

@injectable()
export class BlackTiledGrid {

    public readonly NUMBER_OF_TILES: number = this.SIZE_GRID_X * this.SIZE_GRID_Y;
    public readonly NUM_BLACK_TILES: number = this.NUMBER_OF_TILES * BLACK_TILES_RATIO;

    private wordId: number = 0;
    private wordDefinitionID: number;
    private words: Word[];

    public get $words(): Word[] {
        return this.words;
    }

    public constructor(
        private SIZE_GRID_X: number,
        private SIZE_GRID_Y: number,
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
        for (const row of this.grid) {
            for (const box of row) {
                totalDifficulty += box.$difficulty;
            }
        }
        let maxWordLength: number = 0;
        let minLengthWordQuantity: number = 0;
        for (const word of this.words) {
            if (word.$length > maxWordLength) {
                maxWordLength = word.$length;
            }
            if (word.$length === MIN_WORD_LENGTH) {
                minLengthWordQuantity++;
            }
        }
        totalDifficulty += this.SIZE_GRID_X - maxWordLength + minLengthWordQuantity;
        // console.log(this.$words.length);

        return totalDifficulty;
    }

    private createShuffledArray(): Array<Vec2> {
        const array: Array<Vec2> = [];
        let arrayIndex: number = 0;
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                array[arrayIndex++] = new Vec2(j, i);
            }
        }

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
        this.wordDefinitionID = 1;
        this.words = [];
        let isValid: boolean = this.createWordsInGridHorizontally();
        if (isValid) {
            isValid = this.createWordsInGridVertically();
        }

        return isValid;
    }

    private createWordsInGridHorizontally(): boolean {
        let wordCount: number = 0;
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                if (this.grid[i][j].$black) {
                    continue;
                }
                const wordLength: number = this.calculateWordLength(HORIZONTAL, i, j);
                if (wordLength < MIN_WORD_LENGTH) {
                    if (!this.verifyVertically(i, j)) {
                        return false;
                    }
                } else {
                    this.words[this.wordId - 1] =
                        new Word(this.wordId, this.wordDefinitionID++, HORIZONTAL, wordLength, this.grid[i][j].$id);
                    for (let k: number = j; k < j + wordLength; k++) {
                        this.grid[i][k].addConstraint(this.words[this.wordId - 1]);
                    }
                    j += wordLength; wordCount++; this.wordId++;
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
        if (i + 1 < this.SIZE_GRID_Y) {
            return !this.grid[i + 1][j].$black;
        }
        if (i - 1 > 0) {
            return !this.grid[i - 1][j].$black;
        }

        return false;
    }

    private createWordsInGridVertically(): boolean {
        let wordCount: number = 0;
        for (let i: number = 0; i < this.SIZE_GRID_X; i++) {
            for (let j: number = 0; j < this.SIZE_GRID_Y; j++) {
                if (this.grid[j][i].$black) {
                    continue;
                }
                const wordLength: number = this.calculateWordLength(VERTICAL, i, j);

                if (wordLength >= MIN_WORD_LENGTH) {
                    this.words[this.wordId - 1] =
                        new Word(this.wordId, this.findHorizontalWordDefID(i, j), VERTICAL, wordLength, this.grid[j][i].$id);
                    for (let k: number = j; k < j + wordLength; k++) {
                        this.grid[k][i].addConstraint(this.words[this.wordId - 1]);
                    }
                    j += wordLength; wordCount++; this.wordId++;
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
            if (word.$startPosition.$x === i && word.$startPosition.$y === j) {
                return word.$definitionID;
            }
        }

        return this.wordDefinitionID++;
    }
}
