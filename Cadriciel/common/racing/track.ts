import { CommonCoordinate3D } from "./commonCoordinate3D";
import { TrackType } from "./trackType";

export class TrackStructure {
    public _id: string;
    public _isTestTrack: boolean = false;
    public name: string = "New Track";
    public description: string = "";
    public timesPlayed: number;
    public bestTimes: number[];
    public type: TrackType = TrackType.Default;
    public vertices: Array<CommonCoordinate3D> = new Array();

    public static getNewDefaultTrackStructure(): TrackStructure {
        const newTrack: TrackStructure = new TrackStructure();
        newTrack._id = undefined;
        newTrack._isTestTrack = false;
        newTrack.description = "";
        newTrack.name = "New Track";
        newTrack.bestTimes = [0, 0, 0];
        newTrack.timesPlayed = 0;
        newTrack.type = TrackType.Default;
        newTrack.vertices = [
            new CommonCoordinate3D(0, 0, 0),
            new CommonCoordinate3D(100, 0, 0),
            new CommonCoordinate3D(100, 0, 100),
            new CommonCoordinate3D(0, 0, 100)
        ];

        return newTrack;
    }
}
