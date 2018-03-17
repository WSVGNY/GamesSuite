import { CommonCoordinate2D } from "../../../common/crossword/commonCoordinate2D";
import { CommonWord } from "../../../common/crossword/commonWord";

export class Word implements CommonWord {

    public isComplete: boolean;
    public value: string;
    public definition: string;
    public constraints: Word[];
    public difficulty: number;
    public parentCaller: CommonWord;
    public enteredCharacters: number;
    public constructor(
        public id: number,
        public definitionID: number,
        public isHorizontal: boolean,
        public length: number,
        public startPosition: CommonCoordinate2D) {
        this.constraints = new Array<Word>();
        this.isComplete = false;
        this.difficulty = 0;
        this.enteredCharacters = 0;
    }

    public addConstraint(word: Word): void {
        this.constraints[this.difficulty] = word;
        this.difficulty++;
    }

}
