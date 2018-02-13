import { Word } from "../../../common/crossword/word";
import { GridBox } from "../../../common/crossword/gridBox";

export class WordConstraint {
    private _readyValue: string = "";
    private _originalValue: string = "";
    constructor(word: Word, grid: GridBox[][]) {

        for (let i: number = 0; i < word.length; ++i) {
            let charToAdd: string;
            word.horizontal ?
                charToAdd = grid[word.startPosition.y][word.startPosition.x + i].char.value :
                charToAdd = grid[word.startPosition.y + i][word.startPosition.x].char.value;
            this._originalValue += charToAdd;
            if (charToAdd === "?") {
                charToAdd = "%3f";
            }
            this._readyValue += charToAdd;
        }
    }

    public get readyValue(): string {
        return this._readyValue;
    }

    public get originalValue(): string {
        return this._originalValue;
    }
}
