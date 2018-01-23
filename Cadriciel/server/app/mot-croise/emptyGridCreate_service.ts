import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { GridBox } from "../../../common/crossword/gridBox"
import { Word } from "../../../common/crossword/word"
import { Vec2 } from "../../../common/crossword/vec2"

module Route {

    @injectable()
    export class EmptyGrid {

        private readonly sizeGridX = 10;
        private readonly sizeGridY = 10;
        private readonly numberOfTiles = this.sizeGridX * this.sizeGridY;
        private readonly BlackTilesRatio = 0.10 * this.numberOfTiles;
        private grid: GridBox[][];

        public emptyGridCreate(req: Request, res: Response, next: NextFunction): void {
            this.newGrid();
            res.send(this.grid);
        }

        private newGrid() {
            this.grid = new Array<Array<GridBox>>();

            for (let i = 0; i < this.sizeGridY; i++) {
                let row: GridBox[] = new Array<GridBox>();

                for (let j = 0; j < this.sizeGridX; j++) {
                    row.push(new GridBox(this.provideUniqueTileID(), false));
                }
                this.grid.push(row);
            }
            this.placeBlackGridTiles();
        }

        //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        private placeBlackGridTiles(): void {
            //fill array 0->numberOfTile
            let array = this.fillShuffledArray();

            //pick tiles in shuffled array 0->BlackTilesRatio
            for (let i = 0; i < this.BlackTilesRatio; i++) {
                let randomTileId = array[i];
                this.findMatchingTileById(randomTileId).black = true;
            }


            //TODO: Verify that there's no tile left alone horizontally and vertically
            //TODO: Create the words 

        }
        private fillShuffledArray(): Array<number> {
            let array: Array<number> = [];
            for (let i = 0; i < this.numberOfTiles; i++)
                array[i] = i;

            //shuffle array
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        private findMatchingTileById(id: number): GridBox {

            for (let i = 0; i < this.sizeGridY; i++)
                for (let j = 0; j < this.sizeGridX; j++) {
                    if (this.grid[i][j].id == id)
                        return this.grid[i][j];
                }
            throw new Error("GridTile not found");
        }

        private tileIdCounter: number = 0;
        private provideUniqueTileID(): number {
            if (this.tileIdCounter >= this.numberOfTiles)
                throw new Error("Bad Tile ID alloc");
            return this.tileIdCounter++;
        }
    }
}

export = Route;
