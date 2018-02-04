import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { GridBox } from "../../../common/crossword/gridBox";
import { Word } from "../../../common/crossword/word";
import { Vec2 } from "../../../common/crossword/vec2";
// import * as requestPromise from "request-promise-native";
// import { listenerCount } from "cluster";
import { WordFiller } from "./wordFiller";
import { BlackGridTilesPlacer } from "./blackGridTilesPlacer";

@injectable()
export class Grid {

    public readonly SIZE_GRID_X: number = 10;
    public readonly SIZE_GRID_Y: number = 10;
    // TODO: Should not be here
    public readonly NUMBER_OF_TILES: number = this.SIZE_GRID_X * this.SIZE_GRID_Y;

    private grid: GridBox[][];

    public gridCreate(req: Request, res: Response, next: NextFunction): void {
        this.newGrid().then((result: boolean) => res.send(this.grid));

    }

    private async newGrid(): Promise<boolean> {
        const isValidGrid: boolean = false;
        let words: Word[];
        while (!isValidGrid) {
            this.grid = new Array<Array<GridBox>>();
            for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
                const row: GridBox[] = new Array<GridBox>();
                for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                    row.push(new GridBox(new Vec2(j, i), false));
                }
                this.grid.push(row);
            }
            const blackGridTilesPlacer: BlackGridTilesPlacer = new BlackGridTilesPlacer(this.SIZE_GRID_X, this.SIZE_GRID_Y, this.grid);
            const placeBlackGridTilesResult: [boolean, Word[]] = blackGridTilesPlacer.placeBlackGridTiles();
            if (placeBlackGridTilesResult[0]) {
                words = placeBlackGridTilesResult[1];
                break;
            }
        }
        const wordFiller: WordFiller = new WordFiller(this.SIZE_GRID_X, this.SIZE_GRID_Y, this.grid, words);
        await wordFiller.wordFillControler();

        return true;
    }
}
