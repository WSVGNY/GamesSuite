import { Coordinate } from "./coordinate";

export class Word {

    private _value: string;
    private _definition: string;
    public _constraints: Word[] = new Array<Word>();
    private _difficulty: number = 0;
    private _parentCaller: Word;

    public get id(): number {
        return this._id;
    }

    public get isHorizontal(): boolean {
        return this._isHorizontal;
    }

    public set isHorizontal(value: boolean) {
        this._isHorizontal = value;
    }

    public get length(): number {
        return this._length;
    }

    public set length(value: number) {
        this._length = value;
    }

    public get value(): string {
        return this._value;
    }

    public set value(value: string) {
        this._value = value;
    }

    public get definition(): string {
        return this._definition;
    }

    public set definition(value: string) {
        this._definition = value;
    }

    public constructor(
        private _id: number,
        public _definitionID: number,
        public _isHorizontal: boolean,
        private _length: number,
        public _startPosition: Coordinate) {
    }

    public addConstraint(word: Word): void {
        this._constraints[this._difficulty] = word;
        this._difficulty++;
    }

    public get parentCaller(): Word {
        return this._parentCaller;
    }

    public set parentCaller(parent: Word) {
        this._parentCaller = parent;
    }
}