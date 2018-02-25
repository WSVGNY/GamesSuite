import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { Track, TrackDocument } from "../../../common/racing/track";
import { MongoClient } from "mongodb";
import { ObjectId } from "bson";
import { TrackType } from "../../../common/racing/trackType";

@injectable()
export class TrackRoute {

    private readonly DATABASE_URL: string = "mongodb://team:consoeurie@ds125048.mlab.com:25048/log2990";
    private readonly DATABASE: string = "log2990";
    private readonly COLLECTION: string = "tracks";

    public getTrackList(req: Request, res: Response): void {
        MongoClient.connect(this.DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db(this.DATABASE).collection(this.COLLECTION).find().toArray().then((tracksCollection: string[]) => {
                res.json(JSON.stringify(tracksCollection));
                dbConnection.close();
            }).catch((e: Error) => console.error(e));
        }).catch((e: Error) => console.error(e));
    }

    public getTrackFromID(req: Request, res: Response): void {
        MongoClient.connect(this.DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db("log2990").collection(this.COLLECTION)
                .findOne({ "_id": new ObjectId(req.params.id) }).then((document: string) => {
                    const iTrack: TrackDocument = JSON.parse(JSON.stringify(document));
                    res.send(JSON.stringify(iTrack));
                    dbConnection.close();
                }).catch((e: Error) => res.send(e));
        }).catch((e: Error) => res.send(e));
    }

    public newTrack(req: Request, res: Response): void {
        MongoClient.connect(this.DATABASE_URL).then((dbConnection: MongoClient) => {
            const track: Track = new Track(
                {
                    "_id": "",
                    "track": {
                        "name": req.params.name,
                        "description": "",
                        "vertices": [
                            { x: 0, y: 0, z: 50 },
                            { x: 50, y: 0, z: 0 },
                            { x: 0, y: 0, z: -50 },
                            { x: -50, y: 0, z: 0 },
                        ],
                        "type": TrackType.Default
                    }
                }
            );
            dbConnection.db("log2990").collection(this.COLLECTION)
                .insertOne({ track }).then(() => {
                    dbConnection.close().then(() => this.getTrackList(req, res));
                }).catch((e: Error) => res.send(e));
        }).catch((e: Error) => res.send(e));
    }

    public editTrack(req: Request, res: Response): void {
        MongoClient.connect(this.DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db("log2990").collection(this.COLLECTION)
                .updateOne({ "_id": new ObjectId(req.params.id) }, { $set: { ["track"]: req.body } }).then(() => {
                    dbConnection.close().then(() => this.getTrackFromID(req, res));
                }).catch((e: Error) => res.send(e));
        }).catch((e: Error) => res.send(e));
    }

    public deleteTrack(req: Request, res: Response): void {
        MongoClient.connect(this.DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db("log2990").collection(this.COLLECTION)
                .deleteOne({ "_id": new ObjectId(req.params.id) }).then(() => {
                    dbConnection.close().then(() => this.getTrackList(req, res));
                }).catch((e: Error) => res.send(e));
        }).catch((e: Error) => res.send(e));
    }
}
