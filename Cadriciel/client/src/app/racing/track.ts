import { TrackType } from "../../../../common/racing/trackType";
import { CommonCoordinate3D } from "../../../../common/racing/commonCoordinate3D";
import { TrackStructure } from "../../../../common/racing/track";

export class Track {
    private _id: string;
    public name: string;
    public description: string;
    public timesPlayed: number;
    public bestTimes: number[];
    public vertices: CommonCoordinate3D[];
    public type: TrackType;

    public constructor(rawTrackFromServer: TrackStructure) {
        this._id = rawTrackFromServer._id;
        this.name = rawTrackFromServer.name;
        this.description = rawTrackFromServer.description;
        this.vertices = rawTrackFromServer.vertices;
        this.timesPlayed = rawTrackFromServer.timesPlayed;
        this.bestTimes = rawTrackFromServer.bestTimes;
        this.type = rawTrackFromServer.type;
    }

    public get id(): string {
        return this._id;
    }

    public toTrackStructure(): TrackStructure {
        const trackStructure: TrackStructure = new TrackStructure();
        trackStructure._id = this._id;
        trackStructure._isTestTrack = false;
        trackStructure.name = this.name;
        trackStructure.description = this.description;
        trackStructure.vertices = this.vertices;
        trackStructure.bestTimes = this.bestTimes;
        trackStructure.timesPlayed = this.timesPlayed;
        trackStructure.type = this.type;

        return trackStructure;
    }
}
