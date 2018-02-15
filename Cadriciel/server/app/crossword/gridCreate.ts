import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { GridBox } from "../../../common/crossword/gridBox";
import { Coordinate } from "../../../common/crossword/coordinate";
import { Grid } from "../../../common/crossword/grid";
import { WordFiller } from "./wordFiller";
import { BlackTiledGrid } from "./blackTiledGrid";

@injectable()
export class GridCreate {

    private grid: Grid;

    public gridCreate(req: Request, res: Response, next: NextFunction): void {
        this.grid = new Grid();
        this.grid.difficulty = req.params.difficulty;
        this.newGrid().then(() => {
            for (const row of this.grid.boxes) {
                for (const box of row) {
                    box.eliminateConstraints();
                }
            }
            res.send(this.grid);
        }).catch((e: Error) => console.error(e.message));
    }

    private async newGrid(): Promise<void> {
        let restart: boolean;
        do {
            restart = false;
            const isValidGrid: boolean = false;
            while (!isValidGrid) {
                this.grid = new Grid();

                const blackTiledGrid: BlackTiledGrid = new BlackTiledGrid(this.grid.SIZE_GRID_X, this.grid.SIZE_GRID_Y, this.grid.boxes);

                if (blackTiledGrid.words !== undefined) {
                    this.grid.words = blackTiledGrid.words;
                    break;
                }
            }
            const wordFiller: WordFiller =
                new WordFiller(this.grid.SIZE_GRID_X, this.grid.SIZE_GRID_Y, this.grid.difficulty, this.grid.boxes, this.grid.words);
            await wordFiller.wordFillControler().then(
                (passed: boolean) => {
                    if (!passed) {
                        restart = true;
                    }
                }).catch((e: Error) => console.error(e));
        } while (restart);

    }
}
