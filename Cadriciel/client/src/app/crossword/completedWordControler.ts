import { ConfigurationService } from "./configuration/configuration.service";
import { CommonWord } from "../../../../common/crossword/commonWord";
import { ListChecker } from "./listChecker";
import { Updater } from "./updater";
import { Comparator } from "./comparator";

export abstract class CompletedWordControler {
    public static verifyCompletedWords(configuration: ConfigurationService): boolean {
        let selectedWordIsComplete: boolean = false;
        for (const word of configuration.grid.words) {
            selectedWordIsComplete ?
                this.verifyCompletedWord(word, configuration) :
                selectedWordIsComplete = this.verifyCompletedWord(word, configuration);
        }

        return selectedWordIsComplete;
    }

    public static verifyCompletedWord(word: CommonWord, configuration: ConfigurationService): boolean {
        const wordValue: string = this.fillWord(word, configuration);
        if (wordValue === this.getWordValue(word, configuration) && !ListChecker.playersFoundWord(word, configuration)) {
            configuration.currentPlayer.foundWords.push(word);
            configuration.currentPlayer.score++;
            Updater.setFoundBoxes(configuration);
            if (Comparator.compareWords(configuration.currentPlayer.selectedWord, word)) {
                return true;
            }
        }

        return false;
    }

    public static fillWord(word: CommonWord, configuration: ConfigurationService): string {
        let wordValue: string = "";
        for (let i: number = 0; i < word.length; i++) {
            if (word.isHorizontal) {
                if (configuration.grid.boxes[word.startPosition.y][word.startPosition.x + i].inputChar.value !== undefined) {
                    wordValue += configuration.grid.boxes[word.startPosition.y][word.startPosition.x + i].inputChar.value;
                }
            } else {
                if (configuration.grid.boxes[word.startPosition.y + i][word.startPosition.x].inputChar.value !== undefined) {
                    wordValue += configuration.grid.boxes[word.startPosition.y + i][word.startPosition.x].inputChar.value;
                }
            }
        }

        return wordValue;
    }

    public static getWordValue(word: CommonWord, configuration: ConfigurationService): string {
        let value: string = "";
        for (let i: number = 0; i < word.length; i++) {
            word.isHorizontal ?
                value += configuration.grid.boxes[word.startPosition.y][word.startPosition.x + i].char.value :
                value += configuration.grid.boxes[word.startPosition.y + i][word.startPosition.x].char.value;
        }

        return value;
    }

}
