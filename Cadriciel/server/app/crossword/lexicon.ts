import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import * as requestPromise from "request-promise-native";

@injectable()
export class Lexicon {

    /**
     * These functions work asynchronously to get words and definitions from the Datamuse api
     * To get them synchronously, we use a promise to return the result from the server then
     */

    private readonly BASE_URL: string = "https://api.datamuse.com/words?";
    private readonly INDENTATION_LENGTH: number = 2;

    public getWordAndDefinition(req: Request, res: Response, next: NextFunction): void {
        const urlOptions: string = "sp=" + req.params.word + "&md=d";

        requestPromise(this.BASE_URL + urlOptions).then(
            (result: string) => {
                result = JSON.parse(result.toString());
                const wordAndDef: ({ "word": string; } | { "def": string; }) = {
                    "word": result[0]["word"],
                    "def": result[0]["defs"][0].substring(this.INDENTATION_LENGTH)
                };
                res.json(wordAndDef);
            }
        ).catch((e: Error) => console.error(e));
    }

    public getFrequency(req: Request, res: Response, next: NextFunction): void {
        const urlOptions: string = "sp=" + req.params.word + "&md=f";

        requestPromise(this.BASE_URL + urlOptions).then(
            (result: string) => {
                result = JSON.parse(result.toString());
                const num: number = result[0]["tags"][0].substring(this.INDENTATION_LENGTH);
                res.send(num);
            }
        ).catch((e: Error) => console.error(e));
    }

    public getWordListFromConstraint(req: Request, res: Response, next: NextFunction): void {
        const urlOptions: string = "sp=" + req.params.constraints;

        requestPromise(this.BASE_URL + urlOptions).then(
            (result: string) => {
                result = JSON.parse(result.toString());
                res.json(result);
            }
        ).catch((e: Error) => console.error(e));
    }
}
