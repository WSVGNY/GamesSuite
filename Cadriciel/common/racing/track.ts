import { ObjectId } from "../../server/node_modules/@types/bson";

export class Track {
    public constructor(
        private _id: ObjectId,
        private _name: string) {
    };

    public get id(): ObjectId {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }
}