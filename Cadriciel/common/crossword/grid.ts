import { Word } from "../../server/app/crossword/word";
import { Difficulty } from "./difficulty";
import { GridBox } from "../../server/app/crossword/gridBox";
import { Coordinate2D } from "../../server/app/crossword/coordinate2D";

export class Grid {
    public readonly SIZE_GRID_X: number = 10;
    public readonly SIZE_GRID_Y: number = 10;
    public words: Word[];
    public difficulty: Difficulty;
    public boxes: GridBox[][];

    public constructor() {
        this.boxes = new Array<Array<GridBox>>();
        for (let i: number = 0; i < this.SIZE_GRID_Y; i++) {
            const row: GridBox[] = new Array<GridBox>();
            for (let j: number = 0; j < this.SIZE_GRID_X; j++) {
                row.push(new GridBox(new Coordinate2D(j, i), false));
            }
            this.boxes.push(row);
        }
    }

}
