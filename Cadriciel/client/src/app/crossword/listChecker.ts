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

    public static listContainsWord(words: CommonWord[], wordToFind: CommonWord): boolean {
        return words.find((word: CommonWord) => word.id === wordToFind.id) !== undefined;
    }

    public static listContainsBox(boxes: CommonGridBox[], box: CommonGridBox): boolean {
        return boxes.find((box1: CommonGridBox) => box1.id.x === box.id.x && box1.id.y === box.id.y) !== undefined;
    }

    public static playersFoundBox(box: CommonGridBox, configuration: ConfigurationService): boolean {
        if (ListChecker.listContainsBox(configuration.currentPlayer.foundBoxes, box)) {
            return true;
        } else if (configuration.isTwoPlayerGame) {
            return ListChecker.listContainsBox(configuration.otherPlayer.foundBoxes, box);
        }

        return false;
    }

    public static playersSelectedBox(box: CommonGridBox, configuration: ConfigurationService): boolean {
        if (ListChecker.listContainsBox(configuration.currentPlayer.selectedBoxes, box)) {
            return true;
        } else if (configuration.isTwoPlayerGame) {
            return ListChecker.listContainsBox(configuration.otherPlayer.selectedBoxes, box);
        }

        return false;
    }

}
