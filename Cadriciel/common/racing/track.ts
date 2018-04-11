import { CommonCoordinate3D } from "./commonCoordinate3D";
import { TrackType } from "./trackType";
import { CommonHighscore } from "./commonHighscore";

export class Track {
    // tslint:disable:no-string-literal
    public static createFromJSON(stringObject: string): Track {
        const jsonObject: Track = JSON.parse(stringObject) as Track;
        return new Track(
            jsonObject["_id"],
            jsonObject["_isTestTrack"],
            jsonObject["name"],
            jsonObject["description"],
            jsonObject["timesPlayed"],
            jsonObject["bestTimes"],
            jsonObject["type"],
            jsonObject["vertices"]
        );
    }
    // tslint:enable:no-string-literal

    public constructor(
        private _id: string,
        private _isTestTrack: boolean = false,
        public name: string = "New Track",
        public description: string = "",
        public timesPlayed: number = 0,
        public bestTimes: CommonHighscore[] = [{ car: "YELLOW", name: "Bertrand", position: 1, time: 3000 }],
        public type: TrackType = TrackType.Default,
        public vertices: CommonCoordinate3D[] = [new CommonCoordinate3D(0, 0, 0), new CommonCoordinate3D(100, 0, 0), new CommonCoordinate3D(100, 0, 100), new CommonCoordinate3D(0, 0, 100)]) {
    }

    public get isTestTrack(): boolean {
        return this._isTestTrack;
    }

    public get id(): string {
        return this._id;
    }
}
