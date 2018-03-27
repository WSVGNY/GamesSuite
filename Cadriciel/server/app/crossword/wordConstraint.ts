import { Word } from "./word";
import { GridBox } from "./gridBox";

const HTML_QUESTION_MARK: string = "%3f";

export class WordConstraint {
    private _readyValue: string;
    private _originalValue: string;
    constructor(word: Word, grid: GridBox[][]) {

        this._readyValue = "";
        this._originalValue = "";

        for (let i: number = 0; i < word.length; ++i) {
            let charToAdd: string;
            word.isHorizontal ?
                charToAdd = grid[word.startPosition.y][word.startPosition.x + i].char.value :
                charToAdd = grid[word.startPosition.y + i][word.startPosition.x].char.value;
            this._originalValue += charToAdd;
            if (charToAdd === "?") {
                charToAdd = HTML_QUESTION_MARK;
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
