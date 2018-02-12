// export type TrackMap = [{ "key": string, "value": Track }];
export type TrackMap = Array<{ "key": string, "value": Track }>;

export class Track {
    private _name: string;

    public constructor(_name: string) {
        this._name = _name;
    };

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }
}