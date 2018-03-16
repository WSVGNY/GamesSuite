import { CommonCoordinate2D } from "../../../common/crossword/commonCoordinate2D";
import { CommonWord } from "../../../common/crossword/commonWord";

export class Word implements CommonWord {

    public _isComplete: boolean;
    public value: string;
    public definition: string;
    public constraints: CommonWord[];
    public difficulty: number;
    public parentCaller: CommonWord;
    public constructor(
        public id: number,
        public definitionID: number,
        public isHorizontal: boolean,
        public length: number,
        public startPosition: CommonCoordinate2D) {
        this.constraints = new Array<CommonWord>();
        this._isComplete = false;
        this.difficulty = 0;
    }

    public addConstraint(word: Word): void {
        this.constraints[this.difficulty] = word;
        this.difficulty++;
    }

}
