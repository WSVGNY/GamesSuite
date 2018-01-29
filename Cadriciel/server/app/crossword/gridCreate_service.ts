import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { GridBox } from "../../../common/crossword/gridBox";
import { Word } from "../../../common/crossword/word";
import { Vec2 } from "../../../common/crossword/vec2";
import { Char } from "../../../common/crossword/char";

module Route {

    @injectable()
    export class Grid {

        private readonly SIZE_GRID_X: number = 10;
        private readonly SIZE_GRID_Y: number = 10;
        private readonly NUMBER_OF_TILES: number = this.SIZE_GRID_X * this.SIZE_GRID_Y;
        // tslint:disable-next-line:no-magic-numbers
        private readonly BLACK_TILES_RATIO: number = this.NUMBER_OF_TILES * 0.20; // 0.25
        private readonly MIN_WORD_LENGTH: number = 2;
        private grid: GridBox[][];
        private tileIdCounter: Vec2 = new Vec2(0, 0);
        private charGrid: Char[][];

        public gridCreate(req: Request, res: Response, next: NextFunction): void {
            this.newGrid();
            res.send(this.grid);
        }

        private newGrid(): void {
            this.grid = new Array<Array<GridBox>>();

            for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
                const row: GridBox[] = new Array<GridBox>();

                for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                    row.push(new GridBox(new Vec2(this.tileIdCounter.$x, this.tileIdCounter.$y), false));
                    this.tileIdCounter.$x++;
                }
                this.grid.push(row);
                this.tileIdCounter.$y++;
                this.tileIdCounter.$x = 0;
            }
            this.placeBlackGridTiles();
            this.createCharGrid();
            this.bindCharToGrid();
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

        private placeBlackGridTiles(): void {
            // fill array 0->numberOfTile
            let array: Vec2[] = this.fillShuffledArray();

            // pick tiles in shuffled array 0->BLACK_TILES_RATIO
            for (let i: number = 0; i < this.BLACK_TILES_RATIO; i++) {
                const randomTileId: Vec2 = array[i];
                this.findMatchingTileById(randomTileId).$black = true;
            }

            if (!this.verifyBlackGridValidity()){
                this.newGrid();
                this.placeBlackGridTiles();
            }

            // TODO: Verify that there's no tile left alone horizontally and vertically
            // TODO: Create the words

        }

        // returns false if there's a word of 1 letter
        private verifyBlackGridValidity(): boolean {
            let isValid: boolean = this.createWordsInGridHorizontally();
            this.createWordsInGridVertically()

            return isValid;
        }

        // TODO: accept length of 1 if its vertically a word
        // Horizontal MUST be called first because it fills an array that certifies the grid is valid
        // vertical then verifies that if a word is not long enough, that it atleast figures in the valid horizontal grid array
        // if not present, the grid is then declared unvalid

        // tslint:disable-next-line:max-func-body-length
        private createWordsInGridHorizontally(): boolean {
            let isValid: boolean = true;
            for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
                for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                    if (!this.grid[i][j].$black) {
                        let wordLength: number = 1;
                        while (j + wordLength < this.SIZE_GRID_X && !this.grid[i][j + wordLength].$black) {
                            wordLength++;
                        }
                        if (wordLength < this.MIN_WORD_LENGTH) {
                            isValid = false;
                            if(i+1 < this.SIZE_GRID_Y) {
                                isValid=!this.grid[i+1][j].$black;
                            }
                            if(i-1>0 && !isValid){
                                isValid=!this.grid[i-1][j].$black;
                            }
                        } else {
                            // TODO: Change word id
                            this.grid[i][j].$word = new Word(null, null, true, wordLength, this.grid[i][j].$id, null);
                            j += wordLength-1;
                        }
                    }
                }
            }

            return isValid;
        }

        private createWordsInGridVertically(): void {
            for (let i: number = 0; i < this.SIZE_GRID_X; i++) {
                for (let j: number = 0; j < this.SIZE_GRID_Y; j++) {
                    if (!this.grid[j][i].$black) {
                        let wordLength: number = 1;
                        while (j + wordLength < this.SIZE_GRID_Y && !this.grid[j + wordLength][i].$black) {
                            wordLength++;
                        }
                        if (wordLength > this.MIN_WORD_LENGTH) {
                            // TODO: Change word id
                            this.grid[j][i].$word = new Word(null, null, true, wordLength, this.grid[j][i].$id, null);
                            j += wordLength-1;
                        }
                    }
                }
            }
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
    }
}

export = Route;
