import { Word } from "../../server/app/crossword/word";
import { Difficulty } from "./difficulty";
import { GridBox } from "../../server/app/crossword/gridBox";
import { Coordinate2D } from "../../server/app/crossword/coordinate2D";
import { SIZE_GRID_X, SIZE_GRID_Y } from "../../server/app/crossword/configuration";

export class Grid {
    public words: Word[];
    public difficulty: Difficulty;
    public boxes: GridBox[][];

    public constructor() {
        this.boxes = new Array<Array<GridBox>>();
        for (let i: number = 0; i < SIZE_GRID_Y; i++) {
            const row: GridBox[] = new Array<GridBox>();
            for (let j: number = 0; j < SIZE_GRID_X; j++) {
                row.push(new GridBox(new Coordinate2D(j, i), false));
            }
            this.boxes.push(row);
        }
    }

}
