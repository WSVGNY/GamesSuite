import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { Mot } from "../../../common/mot/mot";
import * as https from "https";

module Route {
    @injectable()
    export class Lexique {

        private readonly BASE_URL: string = "https://api.datamuse.com/words?";
        mots: string;

        public getUnMot(req: Request, res: Response, next: NextFunction): void {
            const mot: Mot = new Mot();
            mot.mot = "Lexique dit : ";
            mot.def = "Allo";
            res.send(mot);
        }

        public getUnMotSelonNbLettres(req: Request, res: Response, next: NextFunction, nbLettres: Number): void {
            https.get(this.BASE_URL + "sp=talk&md=d", (ress) => {
                console.log('statusCode:', ress.statusCode);
                console.log('headers:', ress.headers);
              
                ress.on('data', (d) => {
                    this.mots = JSON.parse(d.toString());
                });
            }).on('error', (e) => {
                console.error(e);
            });
            res.send(this.mots[0]["word"]);
        }
    }
}

export = Route;
