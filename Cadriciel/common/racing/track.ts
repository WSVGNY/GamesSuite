export type TrackMapElement = { "key": string, "value": Track };
export interface ITrack {
    _id: string;
    track: {
        _name: string;
        vertices: Array<Vector3>;
    };
}
export class Track {
    private _name: string;
    private _vertices: Array<Vector3>;

    public constructor(rawTrack: ITrack) {
        this._name = rawTrack.track._name;
        this._vertices = rawTrack.track.vertices;
    };

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get vertices(): Array<Vector3> {
        return this._vertices;
    }

    public set vertices(value: Array<Vector3>) {
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