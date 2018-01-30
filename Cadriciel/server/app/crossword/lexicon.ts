import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import * as requestPromise from "request-promise-native";
import { Difficulty } from "../../../common/crossword/difficulty"

@injectable()
export class Lexicon {

    private readonly BASE_URL: string = "https://api.datamuse.com/words?";
    private difficulty: Difficulty = Difficulty.EASY;
    private readonly FREQUENCY_DELIMITER: number = 10;

    public getDefinition(word: string): string {
        let definitions: string = word["defs"];
        try {
            if (this.difficulty === Difficulty.EASY)
                return definitions[0];
            else {
                try {
                    return definitions[1];
                } catch (e) {
                    return definitions[0];
                }
            }
        } catch (e) {
            return null;
        }
    }

    private checkFrequency(word: string): boolean {
        let frequency: number = word["tags"][0].substring(2);
        if (this.difficulty === Difficulty.HARD) {
            if (frequency < this.FREQUENCY_DELIMITER)
                return true;
            else
                return false;
        } else {
            if (frequency >= this.FREQUENCY_DELIMITER)
                return true;
            else
                return false;
        }
    }

    public getWordListFromConstraint(req: Request, res: Response): void {
        this.difficulty = req.params.difficulty;

        requestPromise(this.BASE_URL + "sp=" + req.params.constraints + "&md=fd").then(
            (result: string) => {
                let words = JSON.parse(result.toString());
                // console.log(words);
                let random: number;
                let responseWord: { "word": string, "def": string } = {
                    "word": "",
                    "def": ""
                };
                let badWord: boolean = true;

                do {
                    badWord = true;
                    random = Math.floor(Math.random() * words.length);
                    let tempWord = words[random];
                    responseWord.word = tempWord.word;

                    console.log(tempWord.word);

                    if (this.checkFrequency(tempWord)) {
                        responseWord["def"] = this.getDefinition(tempWord);
                        if (responseWord["def"] === null)
                            delete words[tempWord];
                        else
                            badWord = false;
                    } else {
                        let removeIndex = words.findIndex((word: any) => word === tempWord);
                        words.splice(removeIndex, 1);
                    }
                    if (words.length === 0) {
                        responseWord = {
                            "word": "",
                            "def": ""
                        };
                        badWord = false;
                    }
                } while (badWord);

                res.send(responseWord);
            }
        ).catch((e: Error) => {
            console.error(e);
            res.send(500);
        });
    }
}
