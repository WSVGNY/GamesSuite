import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import * as https from "https";
import { IncomingMessage } from "http";

module Route {
    @injectable()
    export class Lexicon {

        /**
         * These functions work asynchronously to get words and definitions from the Datamuse api
         * To get them synchronously, we need to use promises to return the result from the server
         * Example use :    this.getWordAndDefinition("myWord").then(
         *                      (result: string) => {
         *                          myWord.word = result["word"];
         *                          myWord.definition = result["def"];
         *                      }
         *                  ).catch(
         *                      (e: Error) => console.error(e)
         *                  );
         */

        private readonly BASE_URL: string = "https://api.datamuse.com/words?";
        private readonly INDENTATION_LENGTH: number = 2;

        public testLexicon(req: Request, res: Response, next: NextFunction): void {
            this.getWordAndDefinition("test").then(
                (s: string) => res.send(s)
            ).catch(
                (e: Error) => console.error(e)
                );
            // this.getFrequency("talk").then((s: string) => res.send(s));
            // this.getWordListFromConstraint("t??t").then((s) => res.send(s));
            // this.getWordListFromNbLetters(5).then((s) => res.send(s));
        }

        public async getWordAndDefinition(word: String): Promise<string> {
            return new Promise<string>(
                (resolve: (value?: string | PromiseLike<string>) => void, reject: (reason?: Error) => void) => {
                    let wordFromApi: string;
                    https.get(this.BASE_URL + "sp=" + word + "&md=d", (response: IncomingMessage) => {
                        response.on("data", (d: string | Buffer) => {
                            wordFromApi = JSON.parse(d.toString());
                            const array: ({ "word": string; } | { "def": string; })[] =
                                [{ "word": wordFromApi[0]["word"] },
                                 { "def": wordFromApi[0]["defs"][0].substring(this.INDENTATION_LENGTH) }];
                            resolve(JSON.stringify(array));
                        });
                    }).on("error", (e: Error) => {
                        reject(e);
                    });
                });
        }

        public async getFrequency(word: string): Promise<string> {
            return new Promise<string>(
                (resolve: (value?: string | PromiseLike<string>) => void, reject: (reason?: Error) => void) => {
                    let wordFromApi: string;
                    https.get(this.BASE_URL + "sp=" + word + "&md=f", (response: IncomingMessage) => {
                        response.on("data", (d: string | Buffer) => {
                            wordFromApi = JSON.parse(d.toString());
                            const num: string = wordFromApi[0]["tags"][0].substring(this.INDENTATION_LENGTH);
                            resolve(JSON.stringify(num));
                        });
                    }).on("error", (e: Error) => {
                        reject(e);
                    });
                });
        }

        public async getWordListFromNbLetters(nbLetters: Number): Promise<string> {
            let urlOptions = "sp=";
            for (let i: number = 0; i < nbLetters; i++) {
                urlOptions += "?";
            }

            return this.getFromApi(urlOptions);
        }

        public async getWordListFromConstraint(constraint: string): Promise<string> {
            const urlOptions: string = "sp=" + constraint;

            return this.getFromApi(urlOptions);
        }

        private async getFromApi(urlOptions: string): Promise<string> {
            return new Promise<string>(
                (resolve: (value?: string | PromiseLike<string>) => void, reject: (reason?: Error) => void) => {
                    https.get(this.BASE_URL + urlOptions, (response: IncomingMessage) => {
                        response.on("data", (d: string) => {
                            resolve(JSON.parse(d.toString()));
                        });
                    }).on("error", (e: Error) => {
                        reject(e);
                    });
                });
        }
    }
}

export = Route;
