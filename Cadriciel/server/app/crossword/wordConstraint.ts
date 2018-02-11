import { Word } from "../../../common/crossword/word";
import { GridBox } from "../../../common/crossword/gridBox";

export class WordConstraint {
    private readyValue: string = "";
    private originalValue: string = "";
    constructor(word: Word, grid: GridBox[][]) {

        for (let i: number = 0; i < word.$length; ++i) {
            let charToAdd: string;
            word.$horizontal ?
                charToAdd = grid[word.$startPosition.$y][word.$startPosition.$x + i].$char.$value :
                charToAdd = grid[word.$startPosition.$y + i][word.$startPosition.$x].$char.$value;
            this.originalValue += charToAdd;
            if (charToAdd === "?") {
                charToAdd = "%3f";
            }
            this.readyValue += charToAdd;
        }
    }

    public get $readyValue(): string {
        return this.readyValue;
    }

    public get $originalValue(): string {
        return this.originalValue;
    }
}
