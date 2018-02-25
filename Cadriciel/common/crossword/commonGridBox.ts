import { Coordinate2D } from "../../server/app/crossword/coordinate2D";
import { Char } from "../../server/app/crossword/char";
import { Word } from "../../server/app/crossword/word";

export class CommonGridBox {

    public _char: Char;
    public _constraints: Word[] = new Array<Word>();
    public _difficulty: number = 0;
    public _isColored: boolean = false;

    public constructor(public _id: Coordinate2D, public _isBlack: boolean) {
    }

}