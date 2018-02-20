import { CommonChar } from "../../../common/crossword/commonChar";

export class Char extends CommonChar {

    public constructor(char: string) {
        super(char);
    }

    public set value(char: string) {
        if (char.length !== 1) {
            throw new Error("Wrong length for char");
        } else {
            this._value = char;
        }
    }
}
