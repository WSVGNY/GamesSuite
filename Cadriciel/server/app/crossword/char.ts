import { CommonChar } from "../../../common/crossword/commonChar";

export class Char implements CommonChar {

    public constructor(public _value: string) { }

    public set value(char: string) {
        if (char.length !== 1) {
            throw new Error("Wrong length for char");
        } else {
            this._value = char;
        }
    }
}
