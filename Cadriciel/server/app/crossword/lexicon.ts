import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import * as https from "https";

module Route {
    @injectable()
    export class Lexicon {

        private readonly BASE_URL: string = "https://api.datamuse.com/words?";

        public testLexicon(req: Request, res: Response, next: NextFunction): void {
            //this.getDefinition("test").then((s) => res.send(s));
            //this.getWordListFromConstraint("t??t").then((s) => res.send(s));
            this.getWordListFromNbLetters(5).then((s) => res.send(s));
        }


        public getDefinition(word: String): Promise<string> {
            return new Promise<string>((resolve) => {
                let wordFromApi: string;
                https.get(this.BASE_URL + "sp=" + word + "&md=d", (ress) => {
                    ress.on('data', (d) => {
                        wordFromApi = JSON.parse(d.toString());
                        resolve(wordFromApi[0]["defs"]);
                    });
                }).on('error', (e) => {
                    console.error(e);
                });
            });
        }

        public getWordListFromNbLetters(nbLetters: Number): Promise<string> {
            let URLOptions = "sp=";
            for (let i = 0; i < nbLetters; i++) {
                URLOptions += "?";
            }
            return this.getFromApi(URLOptions);
        }

        public getWordListFromConstraint(constraint: string): Promise<string> {
            let URLOptions = "sp=" + constraint;
            return this.getFromApi(URLOptions);
        }

        private getFromApi(URLOptions: string): Promise<string> {
            return new Promise<string>((resolve) => {
                https.get(this.BASE_URL + URLOptions, (response) => {
                    response.on("data", (d) => {
                        resolve (JSON.parse(d.toString()));
                    });
                }).on("error", (e) => {
                    console.error(e);
                });
            });
        }
    }
}

export = Route;
