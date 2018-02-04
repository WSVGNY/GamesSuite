import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { tracks } from "../mock-track";
import { Track } from "../../../common/racing/track";
// import { MongoClient } from "mongodb";

@injectable()
export class TrackRoute {

    // private readonly DATABASE_URL = "mongodb://team:consoeurie@ds125048.mlab.com:25048/log2990";
    // private readonly COLLECTION = "tracks";

    public getTrackList(req: Request, res: Response): void {
        // MongoClient.connect(this.DATABASE_URL).then((db) => {
        //     console.log("Connected successfully to server");

        //     const db = MongoClient.db("tracks");

        //     MongoClient.close();
        // }).catch((e: Error) => console.error());

        res.send(tracks);
    }

    public getTrackFromID(req: Request, res: Response): void {
        res.send(tracks.find((track: Track) => track.$id === req.params.id));
    }

    public newTrack(req: Request, res: Response): void {
        let track: Track = new Track(tracks.length + 1, req.params.name);
        tracks.push(track);
        res.send(track)
    }

    public deleteTrack(req: Request, res: Response): void {
        let removeIndex = tracks.findIndex((track: Track) => {
            let _id: number = req.params.id;
            console.log(track.$id + _id);
            return track.$id == _id;
        });
        console.log(removeIndex);
        tracks.splice(removeIndex, 1);
        res.send(true);
    }
}

