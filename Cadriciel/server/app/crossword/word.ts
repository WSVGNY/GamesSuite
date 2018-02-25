import { Coordinate2D } from "./coordinate2D";
import { CommonWord } from "../../../common/crossword/commonWord";

export class Word extends CommonWord {

    public constructor(
        id: number,
        definitionID: number,
        isHorizontal: boolean,
        length: number,
        startPosition: Coordinate2D) {
        super(id, definitionID, isHorizontal, length, startPosition);
    }

    public addConstraint(word: Word): void {
        this.constraints[this.difficulty] = word;
        this.difficulty++;
    }

}
