import { ConfigurationService } from "./configuration/configuration.service";
import { CommonWord } from "../../../../common/crossword/commonWord";
import { CommonGridBox } from "../../../../common/crossword/commonGridBox";

export abstract class ListChecker {
    private static _configuration: ConfigurationService;

    public static setConfiguration(configurationService: ConfigurationService): void {
        this._configuration = configurationService;
    }

    public static playersFoundWord(word: CommonWord): boolean {
        let contains: boolean = false;
        contains = this.listContainsWord(this._configuration.currentPlayer.foundWords, word);
        if (!contains && this._configuration.isTwoPlayerGame) {
            contains = this.listContainsWord(this._configuration.otherPlayer.foundWords, word);
        }

        return contains;
    }

    public static listContainsWord(words: CommonWord[], word: CommonWord): boolean {
        for (const word1 of words) {
            if (word1.id === word.id) {
                return true;
            }
        }

        return false;
    }

    public static listContainsBox(boxes: CommonGridBox[], box: CommonGridBox): boolean {
        for (const box1 of boxes) {
            if (box1.id.x === box.id.x && box1.id.y === box.id.y) {
                return true;
            }
        }

        return false;
    }

    public static playersFoundBox(box: CommonGridBox): boolean {
        for (const box1 of this._configuration.currentPlayer.foundBoxes) {
            if (box1.id.x === box.id.x && box1.id.y === box.id.y) {
                return true;
            }
        }
        if (this._configuration.isTwoPlayerGame) {
            for (const box1 of this._configuration.otherPlayer.foundBoxes) {
                if (box1.id.x === box.id.x && box1.id.y === box.id.y) {
                    return true;
                }
            }
        }

        return false;
    }

    public static playersSelectedBox(box: CommonGridBox): boolean {
        let contains: boolean = false;
        contains = ListChecker.listContainsBox(this._configuration.currentPlayer.selectedBoxes, box);
        if (!contains && this._configuration.isTwoPlayerGame) {
            contains = ListChecker.listContainsBox(this._configuration.otherPlayer.selectedBoxes, box);
        }

        return contains;
    }

}