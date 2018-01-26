import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { GridBox } from "../../../common/crossword/gridBox";
// import { Word } from "../../../common/crossword/word";
// import { Vec2 } from "../../../common/crossword/vec2";
import { Char } from "../../../common/crossword/char";

module Route {

    @injectable()
    export class Grid {

        private readonly SIZE_GRID_X: number = 10;
        private readonly SIZE_GRID_Y: number = 10;
        private readonly NUMBER_OF_TILES: number = this.SIZE_GRID_X * this.SIZE_GRID_Y;
        // tslint:disable-next-line:no-magic-numbers
        private readonly BLACK_TILES_RATIO: number = this.NUMBER_OF_TILES * 0.1;
        private grid: GridBox[][];
        private tileIdCounter: number = 0;
        private charGrid: Char[][];

        public emptyGridCreate(req: Request, res: Response, next: NextFunction): void {
            this.newGrid();
            res.send(this.grid);
        }

        private newGrid(): void {
            this.grid = new Array<Array<GridBox>>();

            for (let i = 0; i < this.SIZE_GRID_Y; i++) {
                const row: GridBox[] = new Array<GridBox>();

                for (let j = 0; j < this.SIZE_GRID_X; j++) {
                    row.push(new GridBox(this.provideUniqueTileID(), false));
                }
                this.grid.push(row);
            }
            this.placeBlackGridTiles();
            //this.createCharGrid();
        }

        private createCharGrid(): void{
            for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
                for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                    if(this.grid[i][j].black === false){
                        this.charGrid[i][j] = "?";
                    } else {
                        this.charGrid[i][j] = "#";
                    }

                }
            }
        }
        
        private placeBlackGridTiles(): void {
            // fill array 0->numberOfTile
            let array: number[] = this.fillShuffledArray();

            // pick tiles in shuffled array 0->BLACK_TILES_RATIO
            for (let i = 0; i < this.BLACK_TILES_RATIO; i++) {
                let randomTileId: number = array[i];
                this.findMatchingTileById(randomTileId).black = true;
            }

            if (!this.verifyBlackGridValidity()) {
                this.placeBlackGridTiles();
            }

            // TODO: Verify that there's no tile left alone horizontally and vertically
            // TODO: Create the words

        }

        private verifyBlackGridValidity(): boolean {

            let isValid: boolean = true;

            for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
                for (let j: number = 0; j < this.SIZE_GRID_X; j++) {

                }
            }

            return isValid;
        }

        // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        private fillShuffledArray(): Array<number> {
            let array: Array<number> = [];
            for (let i = 0; i < this.NUMBER_OF_TILES; i++) {
                array[i] = i;
            }

            // shuffle array
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }

            return array;
        }

        private findMatchingTileById(id: number): GridBox {

            for (let i = 0; i < this.SIZE_GRID_Y; i++) {
                for (let j = 0; j < this.SIZE_GRID_X; j++) {
                    if (this.grid[i][j].id === id) {
                        return this.grid[i][j];
                    }

                }
            }
            throw new Error("GridTile not found");
        }

        private provideUniqueTileID(): number {
            if (this.tileIdCounter >= this.NUMBER_OF_TILES) {
                throw new Error("Bad Tile ID alloc");
            }

            return this.tileIdCounter++;
        }
    }
}

export = Route;
