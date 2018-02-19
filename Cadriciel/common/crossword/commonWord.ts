import { Coordinate } from "../../server/app/crossword/coordinate";
import { Word } from "../../server/app/crossword/word";

export class CommonWord {

    public _value: string;
    public _definition: string;
    public _constraints: Word[] = new Array<Word>();
    public _difficulty: number = 0;
    public _parentCaller: Word;

    public constructor(
        public _id: number,
        public _definitionID: number,
        public _isHorizontal: boolean,
        public _length: number,
        public _startPosition: Coordinate) {
    }

    public addConstraint(word: Word): void {
        this._constraints[this._difficulty] = word;
        this._difficulty++;
    }
    
}