import { Coordinate } from "./coordinate";
import { Char } from "./char";
import { Word } from "./word";

export class GridBox {

    private _char: Char;
    private _constraints: Word[] = new Array<Word>();
    private _difficulty: number = 0;

    public constructor(private _id: Coordinate, public _isBlack: boolean) {
    }

    public get char(): Char {
        return this._char;
    }

    public set char(value: Char) {
        this._char = value;
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
            constraint._constraints = undefined;
        }
    }

    public get word(): Word {
        return this._constraints[0];
    }
    public get difficulty(): number {
        return this._difficulty;
    }

    public get id(): Coordinate {
        return this._id;
    }

}