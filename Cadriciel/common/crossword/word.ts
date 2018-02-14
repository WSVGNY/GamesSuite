import { Coordinate } from "./coordinate";

export class Word {

    private _value: string;
    private _definition: string;
    private _constraints: Word[] = new Array<Word>();
    private _difficulty: number = 0;
    private _parentCaller: Word;

    public get id(): number {
        return this._id;
    }

    public get definitionID(): number {
        return this._definitionID;
    }

    public set definitionID(value: number) {
        this._definitionID = value;
    }

    public get horizontal(): boolean {
        return this._horizontal;
    }

    public set horizontal(value: boolean) {
        this._horizontal = value;
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

    public get startPosition(): Coordinate {
        return this._startPosition;
    }

    public set startPosition(value: Coordinate) {
        this._startPosition.x = value.x;
        this._startPosition.y = value.x;
    }

    public get definition(): string {
        return this._definition;
    }

    public set definition(value: string) {
        this._definition = value;
    }

    public constructor(
        private _id: number,
        private _definitionID: number,
        private _horizontal: boolean,
        private _length: number,
        private _startPosition: Coordinate) {
    }

    public addConstraint(word: Word): void {
        this._constraints[this._difficulty] = word;
        this._difficulty++;
    }

    public get constraints(): Word[] {
        return this._constraints;
    }

    public resetValue(): void {
        this._value = "";
        for (let i: number = 0; i < this.length; i++) {
            this._value += "?";
        }
    }

    public get parentCaller(): Word {
        return this._parentCaller;
    }

    public set parentCaller(parent: Word) {
        this._parentCaller = parent;
    }
}