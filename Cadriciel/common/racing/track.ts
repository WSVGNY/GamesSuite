import { CommonCoordinate3D } from "./commonCoordinate3D";
import { TrackType } from "./trackType";

export type TrackMapElement = { "key": string, "value": Track };

export interface ITrack {
    _id: string;
    track: {
        name: string;
        description: string;
        timesPlayed: number;
        vertices: Array<CommonCoordinate3D>;
        type: TrackType;
    };
}

export class Track {
    public name: string;
    public description: string;
    public timesPlayed: number;
    public vertices: Array<CommonCoordinate3D>;
    public type: TrackType;

    public constructor(rawTrack: ITrack) {
        this.name = rawTrack.track.name;
        this.description = rawTrack.track.description;
        this.timesPlayed = rawTrack.track.timesPlayed;
        this.vertices = rawTrack.track.vertices;
        this.type = rawTrack.track.type;
    };
}
