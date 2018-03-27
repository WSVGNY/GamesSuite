import { Coordinate2D } from "./coordinate2D";
import { Word } from "./word";
import { CommonGridBox } from "../../../common/crossword/commonGridBox";
import { Char } from "./char";

export class GridBox implements CommonGridBox {

    public char?: Char;
    public constraints: Word[];
    public difficulty: number;
    public isColored?: boolean;
    public inputChar?: Char;
    public isFound?: boolean;

    public constructor(public id: Coordinate2D, public isBlack: boolean) {
        this.difficulty = 0;
        this.constraints = [];
        this.isColored = false;
        this.isFound = false;
        this.inputChar = new Char;
    }

    public addConstraint(word: Word): void {
        this.constraints[this.difficulty] = word;
        this.difficulty++;
    }

    public getConstraint(isHorizontal: boolean): Word {
        for (const constraint of this.constraints) {
            if (constraint.isHorizontal === isHorizontal) {
                return constraint;
            }
        }
        throw new ReferenceError("No corresponding constraint found");
    }

    public eliminateConstraints(): void {
        for (const constraint of this.constraints) {
            constraint.constraints = undefined;
        }
    }

    public get word(): Word {
        return this.constraints[0];
    }

}
