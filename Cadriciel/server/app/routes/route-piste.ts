import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { TRACKS } from "../mock-track";
import { Track } from "../../../common/racing/track";

module Route {

    @injectable()
    export class RoutePiste {

        public getListePistes(req: Request, res: Response, next: NextFunction): void {
            res.send(TRACKS);
        }

        public getPisteParID(req: Request, res: Response, next: NextFunction): void {
            res.send(TRACKS.find((piste: Track) => piste.id === req.params.id));
        }
    }
}

export = Route;
