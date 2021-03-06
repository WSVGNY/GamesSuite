import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import * as requestPromise from "request-promise-native";
import { Difficulty } from "../../../common/crossword/difficulty";
import { ResponseWordFromAPI } from "../../../common/communication/responseWordFromAPI";

const FREQUENCY_DELIMITER: number = 6;
const MIN_NUMBER_OF_DEFINITION: number = 2;
const UNWANTED_CHARACTERS_LENGTH: number = 2;
const ERROR_STATUS_CODE: number = 500;
const DEFINITION_INDEX: string = "defs";
const TAGS_INDEX: string = "tags";
const ADVERBS: string = "a";

@injectable()
export class Lexicon {

    private readonly BASE_URL: string = "https://api.datamuse.com/words?";
    private _difficulty: Difficulty;

    public constructor() {
        this._difficulty = Difficulty.Easy;
    }

    private getDefinition(word: string): string {
        const definitions: string = word[DEFINITION_INDEX];
        if (definitions === undefined || definitions === "") {
            return "";
        }

        for (let i: number = word[DEFINITION_INDEX].length - 1; i >= 0; i--) {
            let counter: number = word[DEFINITION_INDEX].length;
            // Verify that the word isnt an adverb or a word
            if (definitions[i][0] === ADVERBS) {
                word[DEFINITION_INDEX].splice(i, 1);
                counter--;
                if (counter === 0) {
                    return "";
                }
            }
        }

        if (this._difficulty === Difficulty.Easy) {
            return definitions[0];
        } else {
            if (definitions.length >= MIN_NUMBER_OF_DEFINITION) {
                return definitions[1];
            } else {
                return definitions[0];
            }
        }
    }

    private checkFrequency(word: string): boolean {
        const frequency: number = word[TAGS_INDEX][0].substring(UNWANTED_CHARACTERS_LENGTH);
        if (this._difficulty === Difficulty.Hard) {
            return frequency < FREQUENCY_DELIMITER;
        } else {
            return frequency >= FREQUENCY_DELIMITER;
        }
    }

    private removeAccent(word: string): string {
        word = word.replace(new RegExp(/[àáâä]/gi), "A");
        word = word.replace(new RegExp(/ç/gi), "C");
        word = word.replace(new RegExp(/[èéêë]/gi), "E");
        word = word.replace(new RegExp(/[ìíîï]/gi), "I");
        word = word.replace(new RegExp(/[òóôö]/gi), "O");
        word = word.replace(new RegExp(/[ùúûü]/gi), "U");

        return word;
    }

    private removeSpecialCharacters(word: string): string {
        // delete non word characters (hyphens, apostrophes, etc.)
        word = word.replace(new RegExp(/\W/gi), "");

        return word;
    }

    private checkWordValidity(responseWord: ResponseWordFromAPI, randomWordFromList: string): boolean {
        if (this.checkFrequency(randomWordFromList)) {
            responseWord.definition = this.getDefinition(randomWordFromList);
            if (responseWord.definition !== "") {
                return false;
            }
        }

        return true;
    }

    private getValidWordFromList(words: string[]): ResponseWordFromAPI {
        let responseWord: ResponseWordFromAPI = new ResponseWordFromAPI();
        let isBadWord: boolean;
        do {
            isBadWord = true;
            const random: number = Math.floor(Math.random() * words.length);
            const randomWordFromList: string = words[random];
            responseWord.word = randomWordFromList["word"].toUpperCase();

            isBadWord = this.checkWordValidity(responseWord, randomWordFromList);

            if (isBadWord) {
                responseWord = new ResponseWordFromAPI();
                words.splice(words.findIndex((word: string) => word === randomWordFromList), 1);
                if (words.length === 0) {
                    isBadWord = false;
                }
            }

        } while (isBadWord);
        responseWord.word = this.removeSpecialCharacters(this.removeAccent(responseWord.word));

        return responseWord;
    }

    public getWordFromConstraint(req: Request, res: Response): void {
        this._difficulty = req.params.difficulty.toUpperCase();
        requestPromise(this.BASE_URL + "sp=" + this.removeAccent(req.params.constraints) + "&md=fd").then(
            (result: string) => {
                const words: string[] = JSON.parse(result.toString());
                if (words === undefined || words.length === 0) {
                    res.send(new ResponseWordFromAPI());
                } else {
                    res.send(this.getValidWordFromList(words));
                }
            }
        ).catch((e: Error) => {
            res.sendStatus(ERROR_STATUS_CODE);
        });
    }
}
