import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { Mot } from "../../../common/mot/mot";
import * as https from "https";

module Route {
    @injectable()
    export class Lexique {

        private readonly BASE_URL: string = "https://api.datamuse.com/words?";
        mots: Mot[] = [];

        public getUnMot(req: Request, res: Response, next: NextFunction): void {
            const mot: Mot = new Mot("", "");
            mot.mot = "Lexique dit : ";
            mot.def = "Allo";
            res.send(mot);
        }

        public getListeMotSelonNbLettres(req: Request, res: Response, next: NextFunction, nbLettres: Number): void {
            let URLOptions: string = "max=70&sp=";
            for(let i = 0; i < nbLettres; i++){
                URLOptions += "?";
            }
            this.getDeApi(req, res, next, URLOptions);
        }
        
        private getDeApi(req: Request, res: Response, next: NextFunction, URLOptions: string): Object[]{
            this.mots = [];
            https.get(this.BASE_URL + URLOptions, (ress) => {
                ress.on('data', (d) => {
                    let i: number = 0;
                    //let tempMot: Mot = null;
                    JSON.parse(d.toString(), (key: any, value: any) => {
                        console.log(key + " : " + value);
                        if(key == "word"){
                            this.mots.push(new Mot(value, ""));
                        }
                    });
                    res.send(this.mots);
                });
            }).on('error', (e) => {
                console.error(e);
            });
            return null;
        }
    }
}

export = Route;
