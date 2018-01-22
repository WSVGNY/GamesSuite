import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { Mot } from "../../../common/mot/mot";

module Route {
    @injectable()
    export class Lexique {
        public getUnMot(req: Request, res: Response, next: NextFunction): void {
            const mot: Mot = new Mot();
            mot.mot = "Lexique dit : ";
            mot.def = "Allo";
            res.send(mot);
        }
    }
}

export = Route;
