import { Coordinate } from "./coordinate";
import { Char } from "./char";
import { Word } from "./word";

export class GridBox {

    private char: Char;
    private constraints: Word[] = new Array<Word>();
    private difficulty: number = 0;

    public constructor(private id: Coordinate, private black: boolean) {
    };

    public get $char(): Char {
        return this.char;
    }

    public set $char(value: Char) {
        this.char = value;
    }

    public addConstraint(word: Word) {
        this.constraints[this.difficulty] = word;
        this.difficulty++;
    }

    public getConstraint(isHorizontal: boolean): Word {
        for (const constraint of this.constraints) {
            if (constraint.$horizontal === isHorizontal) {
                return constraint;
            }
        }
        throw new Error("No corresponding constraint found");
    }

    public eliminateConstraints(): void {
        this.constraints = undefined;
    }

    public getWord(): Word {
        return this.constraints[0];
    }
    public get $difficulty(): number {
        return this.difficulty;
    }

    public get $id(): Coordinate {
        return this.id;
    }

    public get $black(): boolean {
        return this.black;
    }

    public set $black(black: boolean) {
        this.black = black;
    }


}