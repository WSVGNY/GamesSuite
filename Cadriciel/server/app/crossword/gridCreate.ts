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
        this._grid = new Grid();
        this._grid.difficulty = this._difficulty;
        this._grid.words = new Array<Word>();
        const tempGrid: Array<Array<string>> = [
            ["#", "A", "#", "E", "X", "I", "T", "#", "E", "Q"],
            ["#", "M", "A", "R", "#", "R", "#", "#", "G", "#"],
            ["#", "#", "#", "A", "B", "A", "N", "D", "O", "N"],
            ["#", "#", "B", "#", "E", "N", "#", "E", "#", "#"],
            ["#", "L", "A", "W", "N", "#", "#", "E", "#", "#"],
            ["#", "#", "R", "I", "#", "#", "#", "C", "F", "#"],
            ["S", "P", "E", "N", "D", "#", "#", "E", "#", "#"],
            ["T", "H", "#", "#", "#", "#", "#", "N", "O", "V"],
            ["A", "#", "#", "#", "#", "L", "I", "D", "#", "A"],
            ["Y", "#", "T", "A", "P", "#", "S", "#", "J", "R"]];
        this._grid.words.push(new Word(0, 1, true, 4, new Coordinate2D(0, 3)));
        this._grid.words.push(new Word(1, 2, true, 2, new Coordinate2D(0, 8)));
        this._grid.words.push(new Word(2, 3, true, 3, new Coordinate2D(1, 1)));
        this._grid.words.push(new Word(3, 4, true, 7, new Coordinate2D(2, 3)));
        this._grid.words.push(new Word(4, 5, true, 2, new Coordinate2D(3, 4)));
        this._grid.words.push(new Word(5, 6, true, 4, new Coordinate2D(4, 1)));
        this._grid.words.push(new Word(6, 7, true, 2, new Coordinate2D(5, 2)));
        this._grid.words.push(new Word(7, 8, true, 2, new Coordinate2D(5, 7)));
        this._grid.words.push(new Word(8, 9, true, 5, new Coordinate2D(6, 0)));
        this._grid.words.push(new Word(9, 10, true, 2, new Coordinate2D(7, 0)));
        this._grid.words.push(new Word(10, 11, true, 3, new Coordinate2D(7, 7)));
        this._grid.words.push(new Word(11, 12, true, 3, new Coordinate2D(8, 5)));
        this._grid.words.push(new Word(12, 13, true, 3, new Coordinate2D(9, 2)));
        this._grid.words.push(new Word(13, 14, true, 2, new Coordinate2D(9, 8)));
        this._grid.words.push(new Word(14, 9, false, 4, new Coordinate2D(6, 0)));
        this._grid.words.push(new Word(15, 15, false, 2, new Coordinate2D(0, 1)));
        this._grid.words.push(new Word(16, 16, false, 2, new Coordinate2D(6, 1)));
        this._grid.words.push(new Word(17, 17, false, 4, new Coordinate2D(3, 2)));
        this._grid.words.push(new Word(18, 1, false, 3, new Coordinate2D(0, 3)));
        this._grid.words.push(new Word(19, 18, false, 3, new Coordinate2D(4, 3)));
        this._grid.words.push(new Word(20, 19, false, 3, new Coordinate2D(2, 4)));
        this._grid.words.push(new Word(21, 20, false, 4, new Coordinate2D(0, 5)));
        this._grid.words.push(new Word(22, 21, false, 2, new Coordinate2D(8, 6)));
        this._grid.words.push(new Word(23, 22, false, 7, new Coordinate2D(2, 7)));
        this._grid.words.push(new Word(24, 2, false, 3, new Coordinate2D(0, 8)));
        this._grid.words.push(new Word(25, 23, false, 3, new Coordinate2D(7, 9)));
        for (const word of this._grid.words) {
            word.definition = "n def";
        }
        const difficultyGrid: Array<Array<number>> = [
            [0, 1, 0, 2, 1, 2, 1, 0, 2, 1],
            [0, 2, 1, 2, 0, 1, 0, 0, 1, 0],
            [0, 0, 0, 2, 2, 2, 1, 2, 2, 1],
            [0, 0, 1, 0, 2, 2, 0, 1, 0, 0],
            [0, 1, 2, 2, 2, 0, 0, 1, 0, 0],
            [0, 0, 2, 2, 0, 0, 0, 2, 1, 0],
            [2, 2, 2, 2, 1, 0, 0, 1, 0, 0],
            [2, 2, 0, 0, 0, 0, 0, 2, 1, 2],
            [1, 0, 0, 0, 0, 1, 2, 2, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 0, 1, 2]];
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
