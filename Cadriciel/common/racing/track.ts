import { Coordinate } from "../crossword/coordinate";
export type TrackMapElement = { "key": string, "value": Track };
export interface ITrack {
    _id: string;
    track: {
        _name: string;
        _vertices: Array<Coordinate>;
    };
}
export class Track {
    private _name: string;
    private _vertices: Array<Coordinate>;

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

    public get vertices(): Array<Coordinate> {
        return this._vertices;
    }

    public set vertices(value: Array<Coordinate>) {
        this._vertices = value;
    }

    // public static castStringToTrack(rawString: string): Track {
    //     try {
    //         return new Track(
    //             rawString[<any>"_name"]
    //         );
    //     } catch (error) {
    //         throw "CastException";
    //     }
    // }
}