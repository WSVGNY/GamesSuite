// export type TrackMap = [{ "key": string, "value": Track }];
export type TrackMap = Array<{ "key": string, "value": Track }>;

export class Track {
    private _id: string;
    private _name: string;

    public constructor(track: string) {
        this._id = track["_id"];
        this._name = track["_name"];
    };

    public get id(): string {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }
}