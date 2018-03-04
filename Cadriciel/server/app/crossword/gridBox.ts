import { Coordinate2D } from "./coordinate2D";
import { Word } from "./word";
import { CommonGridBox } from "../../../common/crossword/commonGridBox";
import { Char } from "./char";

export class GridBox implements CommonGridBox {

    public _char?: Char;
    public _constraints: Word[];
    public _difficulty: number;
    public _isColored?: boolean;

    public constructor(public _id: Coordinate2D, public _isBlack: boolean) {
        this._difficulty = 0;
        this._constraints = new Array<Word>();
    }

    public addConstraint(word: Word): void {
        this._constraints[this._difficulty] = word;
        this._difficulty++;
    }

    public getConstraint(isHorizontal: boolean): Word {
        for (const constraint of this._constraints) {
            if (constraint.isHorizontal === isHorizontal) {
                return constraint;
            }
        }
        throw new Error("No corresponding constraint found");
    }

    public eliminateConstraints(): void {
        for (const constraint of this._constraints) {
            constraint.constraints = undefined;
        }
    }

    public get word(): Word {
        return this._constraints[0];
    }
    public get difficulty(): number {
        return this._difficulty;
    }

    public get id(): Coordinate2D {
        return this._id;
    }

}
