import { CommonCoordinate } from "../commonCoordinate";
export type TrackMapElement = { "key": string, "value": Track };
export interface ITrack {
    _id: string;
    track: {
        _name: string;
        _vertices: Array<CommonCoordinate>;
    };
}
export class Track {
    private _name: string;
    private _vertices: Array<CommonCoordinate>;

    public constructor(rawTrack: ITrack) {
        this._name = rawTrack.track._name;
        this._vertices = rawTrack.track._vertices;
    };

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get vertices(): Array<CommonCoordinate> {
        return this._vertices;
    }

    public set vertices(value: Array<CommonCoordinate>) {
        this._vertices = value;
    }

}
