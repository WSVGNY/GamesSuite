import { Coordinate } from "../../server/app/crossword/coordinate";
import { Char } from "../../server/app/crossword/char";
import { Word } from "../../server/app/crossword/word";

export class CommonGridBox {

    public _char: Char;
    public _constraints: Word[] = new Array<Word>();
    public _difficulty: number = 0;
    public _isColored: boolean = false;
    
    public constructor(public _id: Coordinate, public _isBlack: boolean) {
    }

}