import { Word } from "../../../common/crossword/word";
import { Char } from "../../../common/crossword/char";

export class WordConstraint {
    private value: string = "";
    constructor(word: Word, charGrid: Char[][]) {
        if (word.$horizontal) {
            for (let i: number = 0; i < word.$length; ++i) {
                let charToAdd: string = charGrid[word.$startPosition.$y][word.$startPosition.$x + i].$value;
                if (charToAdd === "?") {
                    charToAdd = "%3f";
                }
                this.value += charToAdd;
            }
        } else {
            for (let i: number = 0; i < word.$length; ++i) {
                let charToAdd: string = charGrid[word.$startPosition.$y + i][word.$startPosition.$x].$value;
                if (charToAdd === "?") {
                    charToAdd = "%3f";
                }
                this.value += charToAdd;
            }
        }
    }

    public get $value(): string {
        return this.value;
    }
}
