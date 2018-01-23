import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import * as https from "https";

module Route {
    @injectable()
    export class Lexique {

        private readonly BASE_URL: string = "https://api.datamuse.com/words?";
        mots: string;

        public getDefinition(req: Request, res: Response, next: NextFunction, mot:String): void {
            https.get(this.BASE_URL + "sp="+mot+"&md=d", (ress) => {
                ress.on('data', (d) => {
                    this.mots = JSON.parse(d.toString());
                    res.send(this.mots[0]["defs"]+"\n");
                });
            }).on('error', (e) => {
                console.error(e);
            });
        }

        public getListeMotSelonNbLettres(req: Request, res: Response, next: NextFunction, nbLettres: Number): void {
            let URLOptions: string = "sp=";
            for(let i = 0; i < nbLettres; i++){
                URLOptions += "?";
            }
            this.getDeApi(req, res, next, URLOptions);
        }
        
        private getDeApi(req: Request, res: Response, next: NextFunction, URLOptions: string): Object[]{
            https.get(this.BASE_URL + URLOptions, (ress) => {
                ress.on('data', (d) => {
                    res.send(JSON.parse(d.toString()));
                });
            }).on('error', (e) => {
                console.error(e);
            });
            return null;
        }
    }
}

export = Route;
