import { Track } from "../../../../common/racing/track";
import { Shape } from "three";
import { TrackType } from "../../../../common/racing/trackType";
import { CommonCoordinate3D } from "../../../../common/racing/commonCoordinate3D";

export class TrackShape extends Shape {

    public constructor(private _track: Track) {
        super();
    }

    public get name(): string {
        return this._track.name;
    }

    public get description(): string {
        return this._track.description;
    }

    public get bestTimes(): number[] {
        return this._track.bestTimes;
    }

    public get timesPlayed(): number {
        return this._track.timesPlayed;
    }

    public set timesPlayed(timesPlayed: number) {
        this._track.timesPlayed = timesPlayed;
    }

    public get type(): TrackType {
        return this._track.type;
    }

    public get vertices(): CommonCoordinate3D[] {
        return this._track.vertices;
    }

    // public get name(): string {
    //     return this._track.;
    // }
}
