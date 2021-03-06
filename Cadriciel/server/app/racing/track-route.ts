import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { Track } from "../../../common/racing/track";
import { MongoClient, InsertOneWriteOpResult, UpdateWriteOpResult } from "mongodb";
import { ObjectId } from "bson";

const DATABASE_URL: string = "mongodb://team:consoeurie@ds125048.mlab.com:25048/log2990";
const DATABASE: string = "log2990";
const COLLECTION: string = "tracks";

@injectable()
export class TrackRoute {
    public getTrackList(req: Request, res: Response): void {
        MongoClient.connect(DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db(DATABASE).collection(COLLECTION).find().toArray().then((tracksCollection: string[]) => {
                const noTestTracks: string[] = tracksCollection.filter(
                    (document: string) => !Track.createFromJSON(JSON.stringify(document)).isTestTrack);
                res.send(noTestTracks);
                dbConnection.close().catch((e: Error) => res.send(e));
            }).catch((e: Error) => console.error(e));
        }).catch((e: Error) => console.error(e));
    }

    public getTrackFromID(req: Request, res: Response): void {
        MongoClient.connect(DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db(DATABASE).collection(COLLECTION)
                .findOne({ "_id": new ObjectId(req.params.id) }).then((document: string) => {
                    res.send(Track.createFromJSON(JSON.stringify(document)));
                    dbConnection.close().catch((e: Error) => res.send(e));
                }).catch((e: Error) => res.send(e));
        }).catch((e: Error) => res.send(e));
    }

    public newTrack(req: Request, res: Response): void {
        MongoClient.connect(DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db(DATABASE).collection(COLLECTION)
                .insertOne(req.body).then((result: InsertOneWriteOpResult) => {
                    req.params.id = result.insertedId;
                    dbConnection.close().then(() => this.getTrackFromID(req, res)).catch((e: Error) => res.send(e));
                }).catch((e: Error) => res.send(e));
        }).catch((e: Error) => res.send(e));
    }

    public editTrack(req: Request, res: Response): void {
        delete req.body._id;
        MongoClient.connect(DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db(DATABASE).collection(COLLECTION)
                .updateOne({ "_id": new ObjectId(req.params.id) }, { $set: req.body }).then((result: UpdateWriteOpResult) => {
                    dbConnection.close().then(() => this.getTrackFromID(req, res)).catch((e: Error) => res.send(e));
                }).catch((e: Error) => res.send(e));
        }).catch((e: Error) => res.send(e));
    }

    public deleteTrack(req: Request, res: Response): void {
        MongoClient.connect(DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db(DATABASE).collection(COLLECTION)
                .deleteOne({ "_id": new ObjectId(req.params.id) }).then(() => {
                    dbConnection.close().then(() => this.getTrackList(req, res)).catch((e: Error) => res.send(e));
                }).catch((e: Error) => res.send(e));
        }).catch((e: Error) => res.send(e));
    }
}
