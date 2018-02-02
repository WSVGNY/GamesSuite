import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { TRACKS } from "../mock-track";
import { Track } from "../../../common/racing/track";

@injectable()
export class TrackRoute {

    public getTrackList(req: Request, res: Response): void {
        res.send(TRACKS);
    }

    public getTrackFromID(req: Request, res: Response, ): void {
        res.send(TRACKS.find((track: Track) => track.id === req.params.id));
    }
}

