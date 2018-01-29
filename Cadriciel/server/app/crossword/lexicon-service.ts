import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import * as https from "https";
import { IncomingMessage } from "http";

module Route {
    @injectable()
    export class LexiconService {

        /**
         * These functions work asynchronously to get words and definitions from the Datamuse api
         * To get them synchronously, we use a promise to return the result from the server then
         */

        private readonly BASE_URL: string = "https://api.datamuse.com/words?";
        private readonly INDENTATION_LENGTH: number = 2;

        public getWordAndDefinition(req: Request, res: Response, next: NextFunction): void {
            const urlOptions: string = "sp=" + req.params.word + "&md=d";

            this.getFromApi(urlOptions).then(
                (result: string) => {
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

            this.getFromApi(urlOptions).then(
                (result: string) => {
                    const num: number = result[0]["tags"][0].substring(this.INDENTATION_LENGTH);
                    res.send(num);
                }
            ).catch((e: Error) => console.error(e));
        }

        public getWordListFromConstraint(req: Request, res: Response, next: NextFunction): void {
            const urlOptions: string = "sp=" + req.params.constraints;

            this.getFromApi(urlOptions).then(
                (result: string) => {
                    res.json(result);
                }
            ).catch((e: Error) => console.error(e));
        }

        private async getFromApi(urlOptions: string): Promise<string> {
            return new Promise<string>(
                (resolve: (value?: string | PromiseLike<string>) => void, reject: (reason?: Error) => void) => {
                    https.get(this.BASE_URL + urlOptions, (response: IncomingMessage) => {
                        response.on("data", (d: string | Buffer) => {
                            resolve(JSON.parse(d.toString()));
                        });
                    }).on("error", (e: Error) => {
                        reject(e);
                    });
                }
            );
        }
    }
}

export = Route;
