import { Word } from "./word";
import { GridBox } from "./gridBox";

export class WordConstraint {
    private _readyValue: string = "";
    private _originalValue: string = "";
    constructor(word: Word, grid: GridBox[][]) {

        for (let i: number = 0; i < word._length; ++i) {
            let charToAdd: string;
            word._isHorizontal ?
                charToAdd = grid[word._startPosition._y][word._startPosition._x + i]._char._value :
                charToAdd = grid[word._startPosition._y + i][word._startPosition._x]._char._value;
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
