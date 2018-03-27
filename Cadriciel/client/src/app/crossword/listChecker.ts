import { ConfigurationService } from "./configuration/configuration.service";
import { CommonWord } from "../../../../common/crossword/commonWord";
import { CommonGridBox } from "../../../../common/crossword/commonGridBox";
import { Comparator } from "./comparator";

export abstract class ListChecker {
    public static playersFoundWord(word: CommonWord, configuration: ConfigurationService): boolean {
        return configuration.isTwoPlayerGame ?
            this.listContainsWord(configuration.otherPlayer.foundWords, word) ||
            this.listContainsWord(configuration.currentPlayer.foundWords, word) :
            this.listContainsWord(configuration.currentPlayer.foundWords, word);
    }

    public static listContainsWord(words: CommonWord[], wordToFind: CommonWord): boolean {
        return words.find((word: CommonWord) => word.id === wordToFind.id) !== undefined;
    }

    public static listContainsBox(boxes: CommonGridBox[], box: CommonGridBox): boolean {
        return boxes.find((box1: CommonGridBox) => Comparator.compareBoxes(box, box1)) !== undefined;
    }

    public static playersFoundBox(box: CommonGridBox, configuration: ConfigurationService): boolean {
        return configuration.isTwoPlayerGame ?
            ListChecker.listContainsBox(configuration.otherPlayer.foundBoxes, box) ||
            ListChecker.listContainsBox(configuration.currentPlayer.foundBoxes, box) :
            ListChecker.listContainsBox(configuration.currentPlayer.foundBoxes, box);
    }

    public static playersSelectedBox(box: CommonGridBox, configuration: ConfigurationService): boolean {
        return configuration.isTwoPlayerGame ?
            ListChecker.listContainsBox(configuration.otherPlayer.selectedBoxes, box) ||
            ListChecker.listContainsBox(configuration.currentPlayer.selectedBoxes, box) :
            ListChecker.listContainsBox(configuration.currentPlayer.selectedBoxes, box);
    }

}
