import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import * as https from "https";

module Route {
    @injectable()
    export class Lexicon {

        private readonly BASE_URL: string = "https://api.datamuse.com/words?";
        private words: string;

        public getDefinition(req: Request, res: Response, next: NextFunction, word: String): void {
            https.get(this.BASE_URL + "sp=" + word + "&md=d", (ress) => {
                ress.on('data', (d) => {
                    this.words = JSON.parse(d.toString());
                    res.send(this.words[0]["defs"] + "\n");
                });
            }).on('error', (e) => {
                console.error(e);
            });
        }

        public getWordListFromNbLetters(req: Request, res: Response, next: NextFunction, nbLetters: Number): void {
            let URLOptions = "sp=";
            for(let i = 0; i < nbLetters; i++) {
                URLOptions += "?";
            }
            this.getFromApi(req, res, next, URLOptions);
        }

        private getFromApi(req: Request, res: Response, next: NextFunction, URLOptions: string): Object[] {
            https.get(this.BASE_URL + URLOptions, (response) => {
                response.on("data", (d) => {
                    res.send(JSON.parse(d.toString()));
                });
            }).on("error", (e) => {
                console.error(e);
            });

            return null;
        }
    }
}

export = Route;
