import { CommonCoordinate3D } from "./commonCoordinate3D";
export type TrackMapElement = { "key": string, "value": Track };
export interface ITrack {
    _id: string;
    track: {
        name: string;
        vertices: Array<CommonCoordinate3D>;
    };
}
export class Track {
    public name: string;
    public vertices: Array<CommonCoordinate3D>;

    public constructor(rawTrack: ITrack) {
        this.name = rawTrack.track.name;
        this.vertices = rawTrack.track.vertices;
    };
}
