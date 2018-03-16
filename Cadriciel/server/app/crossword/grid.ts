import { Word } from "./word";
import { GridBox } from "./gridBox";
import { Coordinate2D } from "./coordinate2D";
import { CommonGrid } from "../../../common/crossword/commonGrid";
import { SIZE_GRID_X, SIZE_GRID_Y } from "./configuration";
import { Difficulty } from "../../../common/crossword/difficulty";

export class Grid implements CommonGrid {
    public words: Word[];
    public difficulty?: Difficulty;
    public boxes: GridBox[][];

    public constructor() {
        this.boxes = new Array<Array<GridBox>>();
        for (let i: number = 0; i < SIZE_GRID_Y; i++) {
            const row: GridBox[] = new Array<GridBox>();
            for (let j: number = 0; j < SIZE_GRID_X; j++) {
                row.push(new GridBox(new Coordinate2D(i, j), false));
            }
            this.boxes.push(row);
        }
    }

}
