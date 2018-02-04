import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import * as requestPromise from "request-promise-native";
import { Difficulty } from "../../../common/crossword/difficulty"
import { ResponseWordFromAPI } from "../../../common/communication/responseWordFromAPI";

@injectable()
export class Lexicon {

    private readonly BASE_URL: string = "https://api.datamuse.com/words?";
    private difficulty: Difficulty;
    private readonly FREQUENCY_DELIMITER: number = 10;
    private readonly INTERNAL_SERVER_ERROR_CODE: number = 500;

    private getDefinition(word: string): string {
        const definitions: string = word["defs"];
        if (definitions === undefined) {
            return "";
        }
        for (let i: number = 0; i < (word["defs"].length); i++) {
            let counter: number = word["defs"].length;
            if (definitions[i][0] === "a") {                 // s'assurer que le mot ne soit ni un adverbe ni un adjectif
                delete (word["defs"][i]);
                counter--;
                if (counter === 0) {
                    return "";
                }
            }
        }
        if (this.difficulty === "EASY") {
            return definitions[0];
        } else {
            if (definitions.length >= 2) {
                return definitions[1];
            } else {
                return definitions[0];
            }
        }
    }

    private checkFrequency(word: string): boolean {
        const frequency: number = word["tags"][0].substring(2);
        if (this.difficulty === "HARD") {
            if (frequency < this.FREQUENCY_DELIMITER) {
                return true;
            } else {
                return false;
            }
        } else {
            if (frequency >= this.FREQUENCY_DELIMITER) {
                return true;
            } else {
                return false;
            }
        }
    }

    private removeAccent(word: string): string {
        word = word.replace(new RegExp(/[àáâä]/g), "a");
        word = word.replace(new RegExp(/ç/g), "c");
        word = word.replace(new RegExp(/[èéêë]/g), "e");
        word = word.replace(new RegExp(/[ìíîï]/g), "i");
        word = word.replace(new RegExp(/[òóôö]/g), "o");
        word = word.replace(new RegExp(/[ùúûü]/g), "u");
        word = word.replace(new RegExp(/\W/g), "");        // delete non word characters (hyphens, apostrophes, etc.)

        return word;
    }

    private getValidWordFromList(result: string): ResponseWordFromAPI {
        const words: string[] = JSON.parse(result);
        let responseWord: ResponseWordFromAPI = new ResponseWordFromAPI();
        let badWord: boolean;
        do {
            badWord = true;
            const random: number = Math.floor(Math.random() * words.length);
            const randomWordFromList: string = words[random];
            responseWord.$word = randomWordFromList["word"].toUpperCase();

            if (this.checkFrequency(randomWordFromList)) {
                responseWord.$definition = this.getDefinition(randomWordFromList);
                if (responseWord.$definition !== "") {
                    badWord = false;
                }
            }

            if (badWord) {
                words.splice(words.findIndex((word: string) => word === randomWordFromList), 1);
            }

            if (words.length === 0) {
                responseWord = new ResponseWordFromAPI();
                badWord = false;
            }
        } while (badWord);
        responseWord.$word = this.removeAccent(responseWord.$word);

        return responseWord;
    }

    public getWordFromConstraint(req: Request, res: Response): void {
        this.difficulty = req.params.difficulty;
        requestPromise(this.BASE_URL + "sp=" + req.params.constraints + "&md=fd").then(
            (result: string) => {
                res.send(this.getValidWordFromList(result.toString()));
            }
        ).catch((e: Error) => {
            console.error(e);
            res.send(this.INTERNAL_SERVER_ERROR_CODE);
        });
    }
}
