import { Word } from "../../../common/crossword/word";
import { GridBox } from "../../../common/crossword/gridBox";

export class WordConstraint {
    private value: string = "";
    constructor(word: Word, grid: GridBox[][]) {

        for (let i: number = 0; i < word.$length; ++i) {
            let charToAdd: string;
            word.$horizontal ?
                charToAdd = grid[word.$startPosition.$y][word.$startPosition.$x + i].$char.$value :
                charToAdd = grid[word.$startPosition.$y + i][word.$startPosition.$x].$char.$value;
            if (charToAdd === "?") {
                charToAdd = "%3f";
            }
            this.value += charToAdd;
        }
    }

    public get $value(): string {
        return this.value;
    }
}
