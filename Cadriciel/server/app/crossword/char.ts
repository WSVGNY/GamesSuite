import { CommonChar } from "../../../common/crossword/commonChar";

export class Char implements CommonChar {

    public value: string;

    public setValue(char: string): void {
        if (char.length !== 1) {
            throw new Error("Wrong length for char");
        } else {
            this.value = char;
        }
    }
}
