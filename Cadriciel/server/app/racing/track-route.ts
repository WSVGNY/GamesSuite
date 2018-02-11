import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { Track } from "../../../common/racing/track";
import { MongoClient, ObjectId } from "mongodb";

@injectable()
export class TrackRoute {

    private readonly DATABASE_URL: string = "mongodb://team:consoeurie@ds125048.mlab.com:25048/log2990";
    private readonly DATABASE: string = "log2990";
    private readonly COLLECTION: string = "tracks";

    public getTrackList(req: Request, res: Response): void {
        MongoClient.connect(this.DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db(this.DATABASE).collection(this.COLLECTION).find().toArray().then((tracksCollection: string[]) => {
                const tracks: Track[] = [];
                tracksCollection.forEach((document: string) => tracks.push(new Track(document["track"])));
                res.send(tracks);
                dbConnection.close();
            }).catch((e: Error) => console.error(e));
        }).catch((e: Error) => console.error(e));
    }

    public getTrackFromID(req: Request, res: Response): void {
        MongoClient.connect(this.DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db("log2990").collection(this.COLLECTION)
                .findOne({ "track._id": req.params.id }).then((document: Track) => {
                    res.send(new Track(document["track"]));
                    dbConnection.close();
                }).catch((e: Error) => res.send(e));
        }).catch((e: Error) => res.send(e));
    }

    public newTrack(req: Request, res: Response): void {
        MongoClient.connect(this.DATABASE_URL).then((dbConnection: MongoClient) => {
            const trackToAdd: Track = new Track((new ObjectId()).generate(), req.params.name);
            dbConnection.db("log2990").collection(this.COLLECTION)
                .insertOne({ trackToAdd }).then(() => {
                    res.send(trackToAdd);
                    dbConnection.close();
                }).catch((e: Error) => res.send(e));
        }).catch((e: Error) => res.send(e));
    }

    public editTrack(req: Request, res: Response): void {
        MongoClient.connect(this.DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db("log2990").collection(this.COLLECTION)
                .findOne({ "_id": new ObjectId(req.params.id) }).then((document: Track) => {
                    res.send(document);
                    dbConnection.close();
                }).catch((e: Error) => res.send(e));
        }).catch((e: Error) => res.send(e));
    }

    public deleteTrack(req: Request, res: Response): void {
        MongoClient.connect(this.DATABASE_URL).then((dbConnection: MongoClient) => {
            dbConnection.db("log2990").collection(this.COLLECTION)
                .findOne({ "_id": new ObjectId(req.params.id) }).then((document: Track) => {
                    res.send(document);
                    dbConnection.close();
                }).catch((e: Error) => res.send(e));
        }).catch((e: Error) => res.send(e));
    }
}
