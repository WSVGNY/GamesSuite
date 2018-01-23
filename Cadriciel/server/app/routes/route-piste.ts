import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { PISTES } from "../mock-pistes";
import { Piste } from "../../../common/pistes/piste";

module Route {

    @injectable()
    export class RoutePiste {

        public getListePistes(req: Request, res: Response, next: NextFunction): void {
            res.send(PISTES);
        }

        public getPisteParID(req: Request, res: Response, next: NextFunction): void {
            res.send(PISTES.find(piste => piste.id == req.params.id));
        }
    }
}

export = Route;
