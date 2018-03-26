import { ConfigurationService } from "./configuration/configuration.service";
import { ListChecker } from "./listChecker";
import { CommonWord } from "../../../../common/crossword/commonWord";

export abstract class Comparator {

    public static goToNextAvailableBox(configuration: ConfigurationService): void {
        this.isNextIndexOutOfBounds(configuration) ?
            configuration.currentPlayer.selectedWord.enteredCharacters++ :
            configuration.currentPlayer.selectedWord.enteredCharacters = 0;
        if (ListChecker.playersFoundBox(
            configuration.grid.boxes[configuration.getY()][configuration.getX()], configuration)) {
            Comparator.goToNextAvailableBox(configuration);
        }
    }

    private static isNextIndexOutOfBounds(configuration: ConfigurationService): boolean {
        return configuration.currentPlayer.selectedWord.enteredCharacters + 1 <
            configuration.currentPlayer.selectedWord.length;
    }

    public static goBackOneCharacter(configuration: ConfigurationService): void {
        configuration.currentPlayer.selectedWord.enteredCharacters > 0 ?
            configuration.currentPlayer.selectedWord.enteredCharacters-- :
            configuration.currentPlayer.selectedWord.enteredCharacters = configuration.currentPlayer.selectedWord.length - 1;
        if (ListChecker.playersFoundBox(
            configuration.grid.boxes[configuration.getY()][configuration.getX()], configuration)) {
            Comparator.goBackOneCharacter(configuration);
        }
    }

    public static findEquivalent(wordToFind: CommonWord, words: CommonWord[]): CommonWord {
        return words.find((word: CommonWord) => word.id === wordToFind.id);
    }

    public static compareWords(word1: CommonWord, word2: CommonWord): boolean {
        if (word1 === undefined || word2 === undefined) {
            return false;
        }

        return word1.id === word2.id;
    }

}
