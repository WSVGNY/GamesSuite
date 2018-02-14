import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { GridBox } from "../../../common/crossword/gridBox";
import { Word } from "../../../common/crossword/word";
import { Coordinate } from "../../../common/crossword/coordinate";
import { WordFiller } from "./wordFiller";
import { BlackTiledGrid } from "./blackTiledGrid";
import {Difficulty} from "../../../common/crossword/difficulty";

@injectable()
export class Grid {

    public readonly SIZE_GRID_X: number = 10;
    public readonly SIZE_GRID_Y: number = 10;
    private words: Word[];
    private difficulty: Difficulty;
    private grid: GridBox[][];

    public gridCreate(req: Request, res: Response, next: NextFunction): void {
        this.difficulty = req.params.difficulty;
        this.newGrid().then(() => {
            for (const row of this.grid) {
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
                this.createEmptyArray();

                const blackTiledGrid: BlackTiledGrid = new BlackTiledGrid(this.SIZE_GRID_X, this.SIZE_GRID_Y, this.grid);

                if (blackTiledGrid.words !== undefined) {
                    this.words = blackTiledGrid.words;
                    break;
                }
            }
            const wordFiller: WordFiller = new WordFiller(this.SIZE_GRID_X, this.SIZE_GRID_Y,  this.difficulty, this.grid, this.words);
            await wordFiller.wordFillControler().then(
                (passed: boolean) => {
                    if (!passed) {
                        restart = true;
                    }
                }).catch((e: Error) => console.error(e));
        } while (restart);

        }

    private createEmptyArray(): void {
        this.grid = new Array<Array<GridBox>>();
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            const row: GridBox[] = new Array<GridBox>();
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                row.push(new GridBox(new Coordinate(j, i), false));
            }
            this.grid.push(row);
        }
    }
}
