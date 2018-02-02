import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import * as requestPromise from "request-promise-native";
import { Difficulty } from "../../../common/crossword/difficulty"

@injectable()
export class Lexicon {

    private readonly BASE_URL: string = "https://api.datamuse.com/words?";
    private difficulty: Difficulty;
    private readonly FREQUENCY_DELIMITER: number = 10;

    public getDefinition(word: string): string {
        let definitions: string = word["defs"];
        if (definitions === undefined)
            return null;

        for (var i = 0; i < (word["defs"].length); i++) {   
            if (definitions[i][0] == "a") {                 // s'assurer que le mot ne soit ni un adverbe ni un adjectif
                delete (word["defs"][i]);
                return null;
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
        let frequency: number = word["tags"][0].substring(2);
        if (this.difficulty === "HARD") {
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
                    responseWord.word = tempWord.word.toUpperCase();

                    //console.log(tempWord.word + " f=" + tempWord.tags + " def=" + tempWord.defs);

                    if (this.checkFrequency(tempWord)) {
                        responseWord["def"] = this.getDefinition(tempWord);
                        if (responseWord["def"] !== null) {
                            badWord = false;
                        }
                    }
                    if (badWord) {
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
               
                responseWord["word"] = removeAccent(responseWord["word"]);
                responseWord["def"] = responseWord["def"].substring(2);
                
                res.send(responseWord);
            }
        ).catch((e: Error) => {
            console.error(e);
            res.send(500);
        });
    }
}

function removeAccent(word: string) {
    word = word.replace(new RegExp(/[àáâä]/g),"a");
    word = word.replace(new RegExp(/ç/g),"c");
    word = word.replace(new RegExp(/[èéêë]/g),"e");
    word = word.replace(new RegExp(/[ìíîï]/g),"i");                
    word = word.replace(new RegExp(/[òóôö]/g),"o");
    word = word.replace(new RegExp(/[ùúûü]/g),"u");
    word = word.replace(new RegExp(/\W/g),"");        //delete non word characters (hyphens, apostrophes, etc.)
    return word;
}
