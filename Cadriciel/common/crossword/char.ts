export class Char {

    private _value: string;

    public constructor(char: string) {
        this._value = char;
    }

    public get value(): string {
        return this._value;
    }

    public set value(char: string) {
        if (char.length != 1) {
            throw new Error("Wrong length for char")
        }
        else {
            this._value = char;
        }
    }
}