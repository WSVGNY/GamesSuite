import { ConfigurationService } from "./configuration/configuration.service";
import { ListChecker } from "./listChecker";
import { CommonWord } from "../../../../common/crossword/commonWord";

export abstract class Comparator {

    public static goToNextAvailableBox(configuration: ConfigurationService): void {
        configuration.currentPlayer.selectedWord.enteredCharacters + 1 <
            configuration.currentPlayer.selectedWord.length ?
            configuration.currentPlayer.selectedWord.enteredCharacters++ :
            configuration.currentPlayer.selectedWord.enteredCharacters = 0;
        if (ListChecker.playersFoundBox(
            configuration.grid.boxes[configuration.getY()][configuration.getX()])) {
            Comparator.goToNextAvailableBox(configuration);
        }
    }

    public static goBackOneCharacter(configuration: ConfigurationService): void {
        configuration.currentPlayer.selectedWord.enteredCharacters > 0 ?
            configuration.currentPlayer.selectedWord.enteredCharacters-- :
            configuration.currentPlayer.selectedWord.enteredCharacters =
            configuration.currentPlayer.selectedWord.length - 1;
        if (ListChecker.playersFoundBox(
            configuration.grid.boxes[configuration.getY()][configuration.getX()])) {
            Comparator.goBackOneCharacter(configuration);
        }
    }

    public static findEquivalent(badWord: CommonWord, words: CommonWord[]): CommonWord {
        for (const word of words) {
            if (word.id === badWord.id) {
                return word;
            }
        }

        return undefined;
    }

    public static compareWords(word1: CommonWord, word2: CommonWord): boolean {
        if (word1 === undefined || word2 === undefined) {
            return false;
        } else if (word1.id === word2.id) {
            return true;
        } else {
            return false;
        }
    }

}
