export type TrackMapElement = { "key": string, "value": Track };
export interface ITrack {
    _id: string;
    track: {
        _name: string;
    };
}
export class Track {
    private _name: string;

    public constructor(rawTrack: ITrack) {
        this._name = rawTrack.track._name;
    };

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
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