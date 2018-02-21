import { Coordinate } from "./coordinate";
import { CommonWord } from "../../../common/crossword/commonWord";

export class Word extends CommonWord {

    public constructor(
        id: number,
        definitionID: number,
        isHorizontal: boolean,
        length: number,
        startPosition: Coordinate) {
        super(id, definitionID, isHorizontal, length, startPosition);
    }

    public addConstraint(word: Word): void {
        this._constraints[this._difficulty] = word;
        this._difficulty++;
    }

}
