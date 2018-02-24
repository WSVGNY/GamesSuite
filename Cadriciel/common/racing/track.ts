import { CommonCoordinate3D } from "./commonCoordinate3D";
import { TrackType } from "./trackType";

export type TrackMapElement = { "key": string, "value": Track };

export interface TrackDocument {
    _id: string;
    track: {
        name: string;
        vertices: Array<CommonCoordinate3D>;
        type: TrackType;
    };
}

export class Track {
    public name: string;
    public vertices: Array<CommonCoordinate3D>;
    public type: TrackType;

    public constructor(rawTrack: TrackDocument) {
        this.name = rawTrack.track.name;
        this.vertices = rawTrack.track.vertices;
        this.type = rawTrack.track.type;
    };
}
