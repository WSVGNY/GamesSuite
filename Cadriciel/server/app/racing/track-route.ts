import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { Track } from "../../../common/racing/track";
import { tracks } from "../mock-track";
import { MongoClient, ObjectId } from "mongodb";

@injectable()
export class TrackRoute {

    private readonly DATABASE_URL: string = "mongodb://team:consoeurie@ds125048.mlab.com:25048/log2990";
    private readonly DATABASE: string = "log2990";
    private readonly COLLECTION: string = "tracks";

    public getTrackList(req: Request, res: Response): void {
        MongoClient.connect(this.DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db(this.DATABASE).collection(this.COLLECTION).find().toArray().then((tracksFromDb: Track[]) => {
                res.send(tracksFromDb);
                dbConnection.close();
            }).catch((e: Error) => console.error(e));
        }).catch((e: Error) => console.error(e));
    }

    public getTrackFromID(req: Request, res: Response): void {
        MongoClient.connect(this.DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db("log2990").collection(this.COLLECTION)
                .findOne({ "_id": new ObjectId(req.params.id) }).then((document: Track) => {
                    res.send(document);
                    dbConnection.close();
                }).catch((e: Error) => res.send(e));
        }).catch((e: Error) => res.send(e));
    }

    public newTrack(req: Request, res: Response): void {
        const track: Track = new Track((tracks.length + 1).toString(), req.params.name);
        tracks.push(track);
        this.getTrackList(req, res);
    }

    public editTrack(req: Request, res: Response): void {
        const trackFromClient: Track = new Track(req.body["_id"], req.body["name"]);
        const trackIndex: number = tracks.findIndex((track: Track) => track.id === req.params.id);
        tracks[trackIndex] = trackFromClient;
        res.send(tracks[trackIndex]);
    }

    public deleteTrack(req: Request, res: Response): void {
        const removeIndex: number = tracks.findIndex((track: Track) => track.id === req.params.id);
        tracks.splice(removeIndex, 1);
        this.getTrackList(req, res);
    }
}
