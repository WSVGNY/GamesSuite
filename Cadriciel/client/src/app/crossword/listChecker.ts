import { ConfigurationService } from "./configuration/configuration.service";
import { CommonWord } from "../../../../common/crossword/commonWord";

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

}