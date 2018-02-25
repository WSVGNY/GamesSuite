import { Coordinate2D } from "../../server/app/crossword/coordinate2D";
import { Word } from "../../server/app/crossword/word";

export class CommonWord {

    public _isComplete: boolean = false;
    public value: string;
    public definition: string;
    public constraints: Word[] = new Array<Word>();
    public difficulty: number = 0;
    public parentCaller: Word;

    public constructor(
        public id: number,
        public definitionID: number,
        public isHorizontal: boolean,
        public length: number,
        public startPosition: Coordinate2D) {
    }

    public addConstraint(word: Word): void {
        this.constraints[this.difficulty] = word;
        this.difficulty++;
    }

}