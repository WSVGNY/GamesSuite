import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { Grid } from "./grid";
import { WordFiller } from "./wordFiller";
import { BlackTiledGrid } from "./blackTiledGrid";
import { Difficulty } from "../../../common/crossword/difficulty";
import { Word } from "./word";
import { Coordinate2D } from "./coordinate2D";
import { Char } from "./char";

const DEBUG: boolean = true;
@injectable()
export class GridCreate {

    private _grid: Grid;
    private _difficulty: Difficulty;

    public gridCreate(req: Request, res: Response, next: NextFunction): void {
        this._difficulty = req.params.difficulty;
        if (DEBUG) {
            this.createMockGrid();
            res.send(this._grid);
        } else {
            this.newGrid().then(() => {
                for (const row of this._grid.boxes) {
                    for (const box of row) {
                        box.eliminateConstraints();
                    }
                }
                res.send(this._grid);
            }).catch((e: Error) => console.error(e.message));
        }
    }

    private async newGrid(): Promise<void> {
        let isRestartNeeded: boolean;
        do {
            isRestartNeeded = false;
            const isValidGrid: boolean = false;
            while (!isValidGrid) {
                this._grid = new Grid();
                this._grid.difficulty = this._difficulty;
                const blackTiledGrid: BlackTiledGrid = new BlackTiledGrid(this._grid.boxes);
                if (blackTiledGrid.words !== undefined) {
                    this._grid.words = blackTiledGrid.words;
                    break;
                }
            }
            const wordFiller: WordFiller =
                new WordFiller(this._grid.difficulty, this._grid.boxes, this._grid.words);
            await wordFiller.wordFillControler().then(
                (hasPassed: boolean) => {
                    if (!hasPassed) {
                        isRestartNeeded = true;
                    }
                }).catch((e: Error) => console.error(e));
        } while (isRestartNeeded);
    }

    // tslint:disable:max-func-body-length
    // tslint:disable:no-magic-numbers
    private createMockGrid(): void {
        let i: number = 0;
        while (i < 3999999999) {
            i++;
        }
        this._grid = new Grid();
        this._grid.difficulty = this._difficulty;
        this._grid.words = new Array<Word>();
        const tempGrid: Array<Array<string>> = [
            ["#", "#", "#", "E", "X", "I", "T", "#", "#", "#"],
            ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
            ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
            ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
            ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
            ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
            ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
            ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
            ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
            ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#"]];
        this._grid.words.push(new Word(0, 1, true, 4, new Coordinate2D(0, 3)));
        for (const word of this._grid.words) {
            word.definition = "n def";
        }
        const difficultyGrid: Array<Array<number>> = [
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        for (let i: number = 0; i < this._grid.boxes.length; i++) {
            for (let j: number = 0; j < this._grid.boxes.length; j++) {
                this._grid.boxes[i][j].char = new Char();
                this._grid.boxes[i][j].char.setValue(tempGrid[i][j]);
                if (tempGrid[i][j] === "#") {
                    this._grid.boxes[i][j].isBlack = true;
                }
                this._grid.boxes[i][j].difficulty = difficultyGrid[i][j];
                for (const word of this._grid.words) {
                    if (word.startPosition.x === j && word.startPosition.y === i) {
                        for (let h: number = 0; h < word.length; h++) {
                            if (word.isHorizontal) {
                                this._grid.boxes[i][j + h].constraints.push(word);
                            } else {
                                this._grid.boxes[i + h][j].constraints.push(word);
                            }
                        }
                    }
                }
            }
        }
    }
}
