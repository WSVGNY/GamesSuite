import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
//import { Mot } from "../../../common/mot/mot";
import * as https from "https";

module Route {
    @injectable()
    export class Lexique {

        private readonly BASE_URL: string = "https://api.datamuse.com/words?";
        mots: string;

        public getUnMot(req: Request, res: Response, next: NextFunction): void {
 
            https.get(this.BASE_URL + "sp=blue&md=d", (ress) => {
                ress.on('data', (d) => {
                    this.mots = JSON.parse(d.toString());
                    res.send(this.mots[0]["defs"]);
                });
            }).on('error', (e) => {
                console.error(e);
            });
        }

        public getUnMotSelonNbLettres(req: Request, res: Response, next: NextFunction, nbLettres: Number): void {
            https.get(this.BASE_URL + "sp=talk&md=d", (ress) => {
                ress.on('data', (d) => {
                    this.mots = JSON.parse(d.toString());
                    res.send(this.mots[0]["word"]);
                });
            }).on('error', (e) => {
                console.error(e);
            });
        }
    }
}

export = Route;
