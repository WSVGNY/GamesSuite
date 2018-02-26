import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { TrackStructure } from "../../../common/racing/track";
import { MongoClient, InsertOneWriteOpResult, UpdateWriteOpResult } from "mongodb";
import { ObjectId } from "bson";

@injectable()
export class TrackRoute {

    private readonly DATABASE_URL: string = "mongodb://team:consoeurie@ds125048.mlab.com:25048/log2990";
    private readonly DATABASE: string = "log2990";
    private readonly COLLECTION: string = "tracks";

    public getTrackList(req: Request, res: Response): void {
        MongoClient.connect(this.DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db(this.DATABASE).collection(this.COLLECTION).find().toArray().then((tracksCollection: string[]) => {
                const noTestTracks: string[] = tracksCollection.filter(
                    (document: string) => (JSON.parse(JSON.stringify(document)) as TrackStructure)._isTestTrack === false);
                res.json(JSON.stringify(noTestTracks));
                dbConnection.close();
            }).catch((e: Error) => console.error(e));
        }).catch((e: Error) => console.error(e));
    }

    public getTrackFromID(req: Request, res: Response): void {
        MongoClient.connect(this.DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db("log2990").collection(this.COLLECTION)
                .findOne({ "_id": new ObjectId(req.params.id) }).then((document: string) => {
                    const iTrack: TrackStructure = JSON.parse(JSON.stringify(document));
                    res.send(JSON.stringify(iTrack));
                    dbConnection.close();
                }).catch((e: Error) => res.send(e));
        }).catch((e: Error) => res.send(e));
    }

    public newTrack(req: Request, res: Response): void {
        MongoClient.connect(this.DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db("log2990").collection(this.COLLECTION)
                .insertOne(req.body).then((result: InsertOneWriteOpResult) => {
                    req.params.id = result.insertedId;
                    dbConnection.close().then(() => this.getTrackFromID(req, res));
                }).catch((e: Error) => res.send(e));
        }).catch((e: Error) => res.send(e));
    }

    public editTrack(req: Request, res: Response): void {
        delete req.body._id;
        MongoClient.connect(this.DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db("log2990").collection(this.COLLECTION)
                .updateOne({ "_id": new ObjectId(req.params.id) }, { $set: req.body }).then((result: UpdateWriteOpResult) => {
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
