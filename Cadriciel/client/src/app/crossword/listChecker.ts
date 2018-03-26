import { ConfigurationService } from "./configuration/configuration.service";
import { CommonWord } from "../../../../common/crossword/commonWord";
import { CommonGridBox } from "../../../../common/crossword/commonGridBox";

export abstract class ListChecker {
    public static playersFoundWord(word: CommonWord, configuration: ConfigurationService): boolean {
        let contains: boolean = false;
        contains = this.listContainsWord(configuration.currentPlayer.foundWords, word);
        if (!contains && configuration.isTwoPlayerGame) {
            contains = this.listContainsWord(configuration.otherPlayer.foundWords, word);
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

    public static playersFoundBox(box: CommonGridBox, configuration: ConfigurationService): boolean {
        for (const box1 of configuration.currentPlayer.foundBoxes) {
            if (box1.id.x === box.id.x && box1.id.y === box.id.y) {
                return true;
            }
        }
        if (configuration.isTwoPlayerGame) {
            for (const box1 of configuration.otherPlayer.foundBoxes) {
                if (box1.id.x === box.id.x && box1.id.y === box.id.y) {
                    return true;
                }
            }
        }

        return false;
    }

    public static playersSelectedBox(box: CommonGridBox, configuration: ConfigurationService): boolean {
        let contains: boolean = false;
        contains = ListChecker.listContainsBox(configuration.currentPlayer.selectedBoxes, box);
        if (!contains && configuration.isTwoPlayerGame) {
            contains = ListChecker.listContainsBox(configuration.otherPlayer.selectedBoxes, box);
        }

        return contains;
    }

}
