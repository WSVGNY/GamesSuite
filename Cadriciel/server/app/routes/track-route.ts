import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { TRACKS } from "../mock-track";
import { Track } from "../../../common/racing/track";

module Route {

    @injectable()
    export class TrackRoute {

        public getTrackList(req: Request, res: Response, next: NextFunction): void {
            res.send(TRACKS);
        }

        public getTrackFromID(req: Request, res: Response, next: NextFunction): void {
            res.send(TRACKS.find((track: Track) => track.id == req.params.id));
        }
    }
}

export = Route;
