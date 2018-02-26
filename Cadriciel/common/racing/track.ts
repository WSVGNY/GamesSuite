import { CommonCoordinate3D } from "./commonCoordinate3D";
import { TrackType } from "./trackType";

export class TrackStructure {
    public _id: string;
    public _isTestTrack: boolean = false;
    public name: string = "New Track";
    public description: string = "";
    public vertices: Array<CommonCoordinate3D> = new Array();
    public type: TrackType = TrackType.Default;

    public static getNewDefaultTrackStructure(): TrackStructure {
        const newTrack: TrackStructure = new TrackStructure();
        newTrack._id = undefined;
        newTrack._isTestTrack = false;
        newTrack.description = "";
        newTrack.name = "New Track";
        newTrack.type = TrackType.Default;
        newTrack.vertices = [];

        return newTrack;
    }
}
